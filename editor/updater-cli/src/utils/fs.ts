import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

/**
 * Resolves file path to current working directory.
 */
export function resolveToCwd(filename: string = ''): string {
  return path.join(process.cwd(), filename);
}

export const exists = promisify(fs.exists);
export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
