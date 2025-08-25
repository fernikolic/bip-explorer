#!/usr/bin/env node
/**
 * Extract the exact categorization mapping from the shared file
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  const content = readFileSync(path.join(__dirname, 'shared/bip-categories-map.ts'), 'utf8');
  
  // Extract the bipCategoriesMap object
  const mapStart = content.indexOf('export const bipCategoriesMap: Record<number, string[]> = {');
  const mapEnd = content.indexOf('};', mapStart) + 2;
  const mapContent = content.substring(mapStart, mapEnd);
  
  // Extract just the object part
  const objectStart = mapContent.indexOf('{');
  const objectContent = mapContent.substring(objectStart, mapContent.lastIndexOf('}') + 1);
  
  // Clean up and format for JavaScript
  const cleanedContent = objectContent
    .replace(/\/\/.*$/gm, '') // Remove comments
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n+/g, '\n')
    .trim();
  
  console.log('const bipCategoriesMap = ' + cleanedContent + ';');
  console.log('\nTotal entries:', (cleanedContent.match(/\d+:/g) || []).length);
  
} catch (error) {
  console.error('Error:', error.message);
}