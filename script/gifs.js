import { promises as fs } from 'fs'

import logging from 'debug-level'

import glob from 'glob-promise'

const log = logging.log('custom-gifs:gifs')

const checkForBigGifs = (gifsInfo) => {
  const bigGifs = gifsInfo.filter((gif) => gif.size > 2 * 1024 * 1024)

  bigGifs.forEach((gif) => {
    const sizeMB = gif.size / (1024 * 1024)
    const roundedSizeMB = Math.round(sizeMB * 100) / 100

    if (sizeMB > 10) {
      return log.error(
        `${gif.path} is over 10MB at ${roundedSizeMB}MB.`,
        `It's unlikely to display at all, it's suggested that you compress it.`,
      )
    }

    log.warn(
      `${gif.path} is over 2MB at ${roundedSizeMB}MB.`,
      `It won't auto-expand on slack, it's suggested that you compress it.`,
    )
  })
}

const sentCategoryWarnings = {}
async function parseGif(root, categoryTags, gifFullPath) {
  const gifPath = gifFullPath.replace(root + '/', '')
  const [folder, subfolder, ...name] = gifPath.split('/') // only consider the last two folders

  const category = folder
  let subcategory = subfolder

  // Subfolders are optional
  if (!name.length) {
    name.push(subfolder)
    subcategory = undefined
  }

  const categoryText = category.replaceAll('-', ' ')
  const subCategoryText = (subcategory || '').replaceAll('-', ' ')

  if (!categoryTags[category]?.length && !sentCategoryWarnings[category]) {
    log.warn(`Category ${category} doesn't have any tags in categories.json`)
    sentCategoryWarnings[category] = true
  }
  if (
    subcategory &&
    !categoryTags[subcategory]?.length &&
    !sentCategoryWarnings[subcategory]
  ) {
    log.warn(
      `Subcategory ${subcategory} doesn't have any tags in categories.json`,
    )
    sentCategoryWarnings[subcategory] = true
  }

  const { size } = await fs.stat(gifFullPath)

  return {
    name: name
      .join(' ')
      .replace('.gif', '')
      .replaceAll(/[^A-z']/g, ' '),
    path: gifPath,
    category: categoryText,
    categoryTags: categoryTags[category],
    subcategory: subCategoryText,
    subcategoryTags: categoryTags[subcategory] || [],
    size,
  }
}

export const loadGifs = async (path, categoryTags) => {
  log.info('Looking for gifs in ', path)

  const gifs = await glob('/**/*.gif', { root: path })
  const gifsInfo = await Promise.all(
    gifs.map(parseGif.bind(this, path, categoryTags)),
  )

  checkForBigGifs(gifsInfo)

  log.info(`Parsed ${gifsInfo.length} gifs`)

  log.debug('Loaded gifs', gifsInfo)

  return gifsInfo
}

export default {}
