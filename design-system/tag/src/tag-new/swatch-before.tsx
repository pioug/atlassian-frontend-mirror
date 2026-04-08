/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap as cssMapUnbound, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { type TagSwatchBeforeTokenName } from './types';

const tagSwatchBeforeStyles = cssMapUnbound({
	swatch: {
		width: '0.75rem',
		height: '0.75rem',
		borderRadius: token('radius.xsmall'),
		flexShrink: 0,
	},
});

export interface SwatchBeforeProps {
	colorKey: TagSwatchBeforeColorKey;
	/**
	 * - `true`: use `color.background.accent.<colorKey>.subtle` from the tag palette
	 * - string: a design token *path* resolved with `token()` (accent background tokens are typical)
	 */
	swatchBefore?: boolean | TagSwatchBeforeTokenName;
}

const tagSwatchBeforeColorStyles = cssMapUnbound({
	gray: {
		backgroundColor: token('color.background.accent.gray.subtle'),
	},
	blue: {
		backgroundColor: token('color.background.accent.blue.subtle'),
	},
	green: {
		backgroundColor: token('color.background.accent.green.subtle'),
	},
	red: {
		backgroundColor: token('color.background.accent.red.subtle'),
	},
	yellow: {
		backgroundColor: token('color.background.accent.yellow.subtle'),
	},
	purple: {
		backgroundColor: token('color.background.accent.purple.subtle'),
	},
	lime: {
		backgroundColor: token('color.background.accent.lime.subtle'),
	},
	magenta: {
		backgroundColor: token('color.background.accent.magenta.subtle'),
	},
	orange: {
		backgroundColor: token('color.background.accent.orange.subtle'),
	},
	teal: {
		backgroundColor: token('color.background.accent.teal.subtle'),
	},
});

type TagSwatchBeforeColorKey =
	| 'gray'
	| 'blue'
	| 'red'
	| 'yellow'
	| 'green'
	| 'teal'
	| 'purple'
	| 'lime'
	| 'orange'
	| 'magenta';

/**
 * Leading 12×12px swatch for TagNew / TagDropdownTrigger (before elemBefore).
 */
export default function SwatchBefore({
	colorKey,
	swatchBefore,
}: SwatchBeforeProps): JSX.Element | null {
	if (swatchBefore === undefined || swatchBefore === false) {
		return null;
	}
	if (swatchBefore === true) {
		return <span css={[tagSwatchBeforeStyles.swatch, tagSwatchBeforeColorStyles[colorKey]]} />;
	}
	return (
		<span
			css={tagSwatchBeforeStyles.swatch}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{ backgroundColor: swatchBefore }}
		/>
	);
}
