import type { Format } from 'style-dictionary';

import { createSignedArtifact } from '@atlassian/codegen';

import themeConfig, { themeOverrideConfig } from '../../../src/theme-config';

const formatter: Format['formatter'] = () => {
  const imports = Object.entries({ ...themeConfig, ...themeOverrideConfig })
    .map(
      ([key, value]) => `  '${value.id}': () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_${key}" */
      './themes/${key}'
    ),`,
    )
    .join('\n');

  const source = `
import { ThemeIds, ThemeOverrideIds } from '../theme-config';

const themeImportsMap: Record<ThemeIds | ThemeOverrideIds, () => Promise<{ default: string }>> = {
${imports}
};

export default themeImportsMap;
  `;

  return createSignedArtifact(
    source,
    'yarn build tokens',
    `This file contains a dynamic import for each theme this package exports.
    Themes are loaded asynchronously at runtime to minimise the amount of CSS we send to the client.
    This allows users to compose their themes and only use the tokens that are requested.
    When a new theme is created, the import should automatically be added to the map`,
  );
};

export default formatter;
