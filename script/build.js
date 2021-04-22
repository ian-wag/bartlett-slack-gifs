#!/usr/bin/env node

import { promises as fs } from 'fs'
import { join, extname, basename } from 'path'

import logging from 'debug-level'

import glob from 'glob-promise'
import Handlebars from 'handlebars'
import JSON5 from 'json5'

import { loadGifs } from './gifs.js'
import { groupBy, titleize, capitalize } from './utils.js'

const log = logging.log('custom-gifs:build')

const GIFS_PATH = './gifs'
const BUILD_PATH = './build'
const WEB_PATH = './web'

const BUILD_FULL_PATH = join(process.cwd(), BUILD_PATH)
const GIFS_SOURCE_FULL_PATH = join(process.cwd(), GIFS_PATH)
const GIFS_OUTPUT_FULL_PATH = join(BUILD_FULL_PATH, 'gifs')

const VIEWS_FULL_PATH = join(process.cwd(), WEB_PATH, './views')
const PUBLIC_FULL_PATH = join(process.cwd(), WEB_PATH, './public')

/// Helpers

async function copyDir(src, dest, extensionsToCopy, root = false) {
  if (root) {
    log.info(
      `Copying files matching ${extensionsToCopy.join(
        ', ',
      )} from ${src} to ${dest}`,
    )
  } else {
    log.debug(
      `Copying files matching ${extensionsToCopy.join(
        ', ',
      )} from ${src} to ${dest}`,
    )
  }

  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, extensionsToCopy)
    } else {
      const extension = extname(entry.name).toLowerCase()

      const matchesExtension = extensionsToCopy.length
        ? extensionsToCopy.includes(extension)
        : true

      if (matchesExtension) {
        await fs.copyFile(srcPath, destPath)
      } else {
        log.debug(`Ignoring ${entry.name}`)
      }
    }
  }
}

async function generateMetaFile(gifDirectory, buildDirectory) {
  const categories = JSON5.parse(
    await fs.readFile(join(gifDirectory, 'categories.json')),
  )

  const gifs = await loadGifs(buildDirectory, categories)

  const meta = {
    categories,
    gifs,
  }

  log.info(
    `Loaded ${gifs.length} gifs and ${
      Object.keys(categories).length
    } categories`,
  )

  log.debug(`Full meta file`, meta)

  const metaPath = join(buildDirectory, 'meta.json')
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2))
  log.info(`Meta file written to ${metaPath}`)

  return meta
}

async function generateIndex(viewsDirectory, buildDirectory, gifsInfo) {
  const { gifs } = gifsInfo

  Handlebars.registerHelper({
    titleize,
    capitalize,
  })

  const indexHBSPath = join(viewsDirectory, 'index.handlebars')
  const partialsPath = join(viewsDirectory, 'partials/')
  const templateString = await fs.readFile(indexHBSPath)

  const partials = await glob('**/*.handlebars', { root: partialsPath })
  for (const partial of partials) {
    const partialName = basename(partial).split('.')[0]

    log.debug(`Registered partial ${partialName} to ${partial}`)

    const partialTemplate = await fs.readFile(partial)

    Handlebars.registerPartial(partialName, partialTemplate.toString())
  }

  const template = Handlebars.compile(templateString.toString(), {
    noEscape: true,
  })

  const byCategory = groupBy(gifs, 'category')
  Object.keys(byCategory).forEach((key) => {
    byCategory[key] = groupBy(byCategory[key], 'subcategory')
  })
  const output = template({
    categories: byCategory,
  })

  const indexPath = join(buildDirectory, 'index.html')

  await fs.writeFile(indexPath, output)

  log.info(`Index page written to ${indexPath}`)
}

/// Main

async function main() {
  log.info(`Building using gifs in ${GIFS_SOURCE_FULL_PATH}`)

  await copyDir(GIFS_SOURCE_FULL_PATH, GIFS_OUTPUT_FULL_PATH, ['.gif'], true)
  const gifsInfo = await generateMetaFile(
    GIFS_SOURCE_FULL_PATH,
    BUILD_FULL_PATH,
  )

  await copyDir(PUBLIC_FULL_PATH, BUILD_FULL_PATH, [], true)
  await generateIndex(VIEWS_FULL_PATH, BUILD_FULL_PATH, gifsInfo)

  log.info(`Build complete, output in ${BUILD_FULL_PATH}`)
}

main()

// Find all gifs
// Move them to ./build

// Build a meta.json file
// Move the categories file too
