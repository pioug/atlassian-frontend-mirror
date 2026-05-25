/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */
import deprecationWarning from '@atlaskit/ds-lib/deprecation-warning';
import { token } from '@atlaskit/tokens';

import type { Layers } from './types';

export const CHANNEL = '__ATLASKIT_THEME__';
export const DEFAULT_THEME_MODE = 'light';
export const THEME_MODES: string[] = ['light', 'dark'];

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * Please use `@atlaskit/focus-ring` instead.
 */
export const focusRing = (
	color: string = token('color.border.focused'),
	outlineWidth: number = 2,
) => {
	deprecationWarning(
		'@atlaskit/theme',
		'focus ring mixin',
		'Please use `@atlaskit/focus-ring` instead.',
	);
	return `
  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px ${outlineWidth}px ${color};
  }
`;
};

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * Please use `@atlaskit/focus-ring` instead.
 */
export const noFocusRing = () => `
  box-shadow: none;
`;

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

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * Please use `@atlaskit/visually-hidden`
 */
export const visuallyHidden = () => {
	deprecationWarning(
		'@atlaskit/theme',
		'visually hidden mixin',
		'Please use `@atlaskit/visually-hidden` instead.',
	);
	return {
		border: '0 !important',
		clip: 'rect(1px, 1px, 1px, 1px) !important',
		height: '1px !important',
		overflow: 'hidden !important' as 'hidden',
		padding: '0 !important',
		position: 'absolute !important' as 'absolute',
		width: '1px !important',
		whiteSpace: 'nowrap !important' as 'nowrap',
	};
};

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * Please use `@atlaskit/visually-hidden`
 */
export const assistive: () => {
	border: string;
	clip: string;
	height: string;
	overflow: 'hidden';
	padding: string;
	position: 'absolute';
	width: string;
	whiteSpace: 'nowrap';
} = visuallyHidden;
