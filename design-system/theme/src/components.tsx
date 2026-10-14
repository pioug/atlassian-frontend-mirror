/*
	This file will become the new index for theme once the codemod is mature enough.
	For now we're keeping the index file to avoid having to do a major change.
	Once the codemod is done and all the AK modules have been codeshifted, we delete index.js and rename this file to index + update all the imports
*/

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and the supported customization APIs of Atlassian Design System components.
 */

export { getTheme } from './utils/get-theme';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export type { GlobalThemeTokens } from './types';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and the supported customization APIs of Atlassian Design System components.
 */
export { default } from './components/theme';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and the supported customization APIs of Atlassian Design System components.
 */
export type { ThemeProp } from './utils/create-theme';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and the supported customization APIs of Atlassian Design System components.
 */
export { createTheme } from './utils/create-theme';
