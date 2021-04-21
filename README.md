# Gif Repo for Custom Slack Gifs

Uses GitHub pages to serve gifs and meta-data for use by [Pezmc/custom-gifs-slack-command](https://github.com/Pezmc/custom-gifs-slack-command).

## Usage

1. [Fork This Repo](#fork-this-repo)
1. [Enable GitHub Pages](#enable-github-pages)
1. [Add Some Extra Gifs](#add-some-extra-gifs)
1. [Optionally, Add More Tags and Categories](#optionally-add-more-tags-and-categories)
1. Profit!

### Fork This Repo

Take a fork of this repo to host your own gifs.

### Enable GitHub Pages

The repo includes a Github Action that creates the `gh-pages` branch with the output of the build script.

Head to Repo Settings > Pages > Source and select the `gh-pages` branch, with `/ (root)`. If the branch doesn't exist yet, it will be created on the next commit to `main`.

Note the URL the site will be published at at the top of the page.
You'll need this to view the available gifs, and for your Slack command handling!

### Add Some Extra Gifs

> Important: Gifs over 2MB won't auto-expand in Slack, and gifs that are too large (~10MB+ won't load at all).

The gifs are organised into folders and subfolders under `gifs/`, only the deepest two folders are considered when searching.

This repo comes with some examples, and shows how you can nest folders to make searching easier.

When searching for a gif, the name is matched first, followed by the subcategory, then any additional subcategory tags from `gifs/categories.js`, then the category and finally the category tags.

For example:

```
gifs/happy/clap/my-image.gif - will match my image, followed by clap (and tags) then happy (and tags)
gifs/happy/laughing.gif - will match laughing, followed by happy (and tags)
```

You can either add your gifs under the pre-existing folders, or, since only the last two folders are considered, namespace them entirely:

```
gifs/custom/happy/clap/my-image.gif - matches image, clap (and tags), then happy (and tags)
gifs/custom/happy/laughing.gif - matches laughing then happy (and tags), and custom (and tags if any set)
gifs/custom/my-gif.gif - matches my gif, then custom (and tags if set)
```

#### Optionally, Add More Tags and Categories

The tagging metadata file is found in `./gifs/categories.json`, and maps category and subcategory names to extra words or phrases that will match during search.

This means that gifs found in the "yes" folder for example, also match for search with "affirmative, ok, okay" etc...

Subcategories and categories are looked up based on the deepest and second deepest folder, and use the same list. Meaning you can namespace your gifs if you'd like.

## Development

Run:

```bash
yarn install
yarn run build
```

Then check the ./build directory
