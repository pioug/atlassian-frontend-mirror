import fs from 'fs';
import path from 'path';

import type { DeprecatedCategories, DeprecatedConfig } from './types';

export const getConfig = (
  specifier: DeprecatedCategories,
): DeprecatedConfig => {
  const configPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'configs',
    'deprecated.json',
  );
  const source = fs.readFileSync(configPath, 'utf8');
  const parsedConfig = JSON.parse(source);

  return parsedConfig[specifier];
};
