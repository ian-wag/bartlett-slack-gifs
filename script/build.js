#!/usr/bin/env node

import { promises as fs } from 'fs'
import { join, extname } from 'path'

import { loadGifs } from './gifs.js'

import logging from 'debug-level'

import JSON5 from 'JSON5'

const log = logging.log('custom-gifs:build')

const GIFS_PATH = './gifs'
const BUILD_PATH = './build'

const GIFS_FULL_PATH = join(process.cwd(), GIFS_PATH)
const BUILD_FULL_PATH = join(process.cwd(), BUILD_PATH)

/// Helpers

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  const extensionsToCopy = ['.gif']

  log.debug(
    `Copying files matching ${extensionsToCopy.join(
      ', ',
    )} from ${src} to ${dest}`,
  )

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    const extension = extname(entry.name).toLowerCase()

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else if (extensionsToCopy.includes(extension)) {
      await fs.copyFile(srcPath, destPath)
    } else {
      log.debug(`Ignoring ${entry.name}`)
    }
  }
}

async function generateMetaFile(gifDirectory, buildDirectory) {
  const categories = JSON5.parse(
    await fs.readFile(join(gifDirectory, 'categories.json')),
  )

  const gifs = await loadGifs(gifDirectory, categories)

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

  await fs.writeFile(
    join(buildDirectory, 'meta.json'),
    JSON.stringify(meta, null, 2),
  )
}

/// Main

async function main() {
  log.info(`Building using gifs in ${GIFS_FULL_PATH}`)

  await copyDir(GIFS_FULL_PATH, BUILD_FULL_PATH)

  log.info(`Copied all gifs from ${GIFS_FULL_PATH} to ${BUILD_FULL_PATH}`)

  await generateMetaFile(GIFS_FULL_PATH, BUILD_FULL_PATH)

  log.info(`Meta file written to ${BUILD_FULL_PATH}`)
}

main()

// Find all gifs
// Move them to ./build

// Build a meta.json file
// Move the categories file too
