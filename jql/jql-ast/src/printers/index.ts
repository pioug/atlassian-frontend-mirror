import { Jast } from '../types';

import { printAstToDoc } from './print-ast-to-doc';
import { printDocToString, PrintOptions } from './print-doc-to-string';

/**
 * Print the provided AST object into a formatted JQL string.
 */
export const print = (jast: Jast, options?: PrintOptions): string => {
  return printDocToString(printAstToDoc(jast), options);
};
