/*
   This file will become the new index for theme once the codemod is mature enough.
   For now we're keeping the index file to avoid having to do a major change.
   Once the codemod is done and all the AK modules have been codeshifted, we delete index.js and rename this file to index + update all the imports
*/

export { default as getTheme } from './utils/get-theme';
export { default as themed } from './utils/themed';
export { default as AtlaskitThemeProvider } from './components/atlaskit-theme-provider';

export type { GlobalThemeTokens } from './types';

export { default, useGlobalTheme } from './components/theme';

export type { ThemeProp } from './utils/create-theme';

export { createTheme } from './utils/create-theme';
