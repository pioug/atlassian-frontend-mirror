/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */

import type { Layers } from './types';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export const CHANNEL = '__ATLASKIT_THEME__';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export const DEFAULT_THEME_MODE = 'light';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use design tokens and supported Atlassian Design System component APIs instead.
 */
export const THEME_MODES: string[] = ['light', 'dark'];

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2652 Internal documentation for deprecation (no external access)}
 * Use an Atlassian Design System layered component, or `@atlaskit/top-layer` for low-level
 * overlays. Top Layer is not a numeric `z-index` map.
 */
export const layers: { [P in keyof Layers]: () => Layers[P] } = {
	card: () => 100,
	navigation: () => 200,
	dialog: () => 300,
	layer: () => 400,
	blanket: () => 500,
	modal: () => 510,
	flag: () => 600,
	spotlight: () => 700,
	tooltip: () => 9999,
};
