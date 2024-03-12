import type { ImportSource } from '../utils/is-supported-import';

export type RuleConfig = {
  cssFunctions: string[];
  stylesPlacement: 'top' | 'bottom';
  cssImportSource: ImportSource;
  xcssImportSource: ImportSource;
  excludeReactComponents: boolean;
  autoFixNames: boolean;
  fixNamesOnly: boolean;
};
