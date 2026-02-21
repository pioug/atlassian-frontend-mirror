import deprecationWarning from '@atlaskit/ds-lib/deprecation-warning';
import { token } from '@atlaskit/tokens';

import { B200, N20A, N30A } from './colors';
import type { Layers } from './types';

export const CHANNEL = '__ATLASKIT_THEME__';
export const DEFAULT_THEME_MODE = 'light';
export const THEME_MODES: string[] = ['light', 'dark'];

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-386 Internal documentation for deprecation (no external access)}
 * Please use `@atlaskit/focus-ring` instead.
 */
export const focusRing = (
	color: string = token('color.border.focused', B200),
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

/**
 * These styles are mirrored in:
 * packages/design-system/menu/src/internal/components/skeleton-shimmer.tsx
 *
 * Please update both.
 */
export const skeletonShimmer = (): {
	readonly css: {
		readonly backgroundColor: 'var(--ds-skeleton)';
		readonly animationDuration: '1.5s';
		readonly animationIterationCount: 'infinite';
		readonly animationTimingFunction: 'linear';
		readonly animationDirection: 'alternate';
	};
	readonly keyframes: {
		readonly from: {
			readonly backgroundColor: 'var(--ds-skeleton)';
		};
		readonly to: {
			readonly backgroundColor: 'var(--ds-skeleton-subtle)';
		};
	};
} =>
	({
		css: {
			backgroundColor: token('color.skeleton', N20A),
			animationDuration: '1.5s',
			animationIterationCount: 'infinite',
			animationTimingFunction: 'linear',
			animationDirection: 'alternate',
		},
		keyframes: {
			from: {
				backgroundColor: token('color.skeleton', N20A),
			},
			to: {
				backgroundColor: token('color.skeleton.subtle', N30A),
			},
		},
	}) as const;
