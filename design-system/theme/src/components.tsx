/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/*
   This file will become the new index for theme once the codemod is mature enough.
   For now we're keeping the index file to avoid having to do a major change.
   Once the codemod is done and all the AK modules have been codeshifted, we delete index.js and rename this file to index + update all the imports
*/

/**
 * @deprecated Use `import { getTheme } from '@atlaskit/theme/get-theme'` instead.
 */
export { getTheme } from './utils/get-theme';

/**
 * @deprecated Use `import type { GlobalThemeTokens } from '@atlaskit/theme/types'` instead.
 */
export type { GlobalThemeTokens } from './types';

/**
 * @deprecated Use `import Theme from '@atlaskit/theme/theme'` instead.
 */
export { default } from './components/theme';

/**
 * @deprecated Use `import type { ThemeProp } from '@atlaskit/theme/create-theme'` instead.
 */
export type { ThemeProp } from './utils/create-theme';

/**
 * @deprecated Use `import { createTheme } from '@atlaskit/theme/create-theme'` instead.
 */
export { createTheme } from './utils/create-theme';
