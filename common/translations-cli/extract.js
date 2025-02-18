//@ts-check
const fs = require('fs');
const { promisify } = require('util');

const { getFiles } = require('./helpers');

const readFilePromise = promisify(fs.readFile);

const translationRegex = /_t\(\s*['"]([^'"]+)['"]\s*,\s*\{\s*defaultMessage\s*:\s*['"]([^'"]+)['"]\s*\}/g;

/**
 * @param {string} file
 *
 * @returns {Promise<Record<string, string>>}
 */
async function extractTranslationsFromFile(file) {
  /** @type {Record<string, string>} */
  const translations = {};
  const content = await readFilePromise(file, 'utf-8');
  let match;

  while ((match = translationRegex.exec(content)) !== null) {
    const [_, key, defaultText] = match;
    translations[key] = defaultText;
  }

  return translations;
}

/**
 * @param {string[]} directories
 * @param {string[]} extensions
 *
 * @returns {Promise<Record<string, string>>}
 */
async function extractAllTranslations(directories, extensions) {
  try {
    /** @type {Record<string, string>} */
    const allTranslations = {};

    for (const dir of directories) {
      const files = await getFiles(dir, extensions);

      for (const file of files) {
        const fileTranslations = await extractTranslationsFromFile(file);
        Object.assign(allTranslations, fileTranslations);
      }
    }

    console.log(`Total translations found: ${Object.keys(allTranslations).length}`);

    return allTranslations;
  } catch (error) {
    console.error('Error extracting translations:', error);
    throw error;
  }
}
module.exports = {
  extractTranslationsFromFile,
  extractAllTranslations,
};
