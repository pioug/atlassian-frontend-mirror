/*
   This file will become the new index for theme once the codemod is mature enough.
   For now we're keeping the index file to avoid having to do a major change.
   Once the codemod is done and all the AK modules have been codeshifted, we delete index.js and rename this file to index + update all the imports
*/

export { default as getTheme } from './utils/getTheme';
export { default as themed } from './utils/themed';
export { default as AtlaskitThemeProvider } from './components/AtlaskitThemeProvider';

export { GlobalThemeTokens } from './types';
export { default as Appearance } from './components/Appearance';

// New API
export { ResetThemeProps, ResetThemeTokens } from './components/Reset';
export { ResetTheme, Reset } from './components/Reset';

export { default } from './components/Theme';
export { withTheme } from './hoc';

export { ThemeProp } from './utils/createTheme';

export { createTheme } from './utils/createTheme';
