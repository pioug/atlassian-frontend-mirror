import type { ImportSource } from '@atlaskit/eslint-utils/is-supported-import';

export type RuleConfig = {
  cssFunctions: string[];
  stylesPlacement: 'top' | 'bottom';
  cssImportSource: ImportSource;
  xcssImportSource: ImportSource;
  excludeReactComponents: boolean;
  autoFix: boolean;
};
