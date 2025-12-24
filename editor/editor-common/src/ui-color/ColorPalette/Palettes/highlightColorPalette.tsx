/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ComponentProps } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { backgroundColorPalette, backgroundColorPaletteNext } from '@atlaskit/adf-schema';
import { token, useThemeObserver } from '@atlaskit/tokens';

import getColorMessage from './getColorMessage';
import paletteMessages from './paletteMessages';
import { mapPaletteColor } from './textColorPalette';
import type { PaletteColor } from './type';

export const REMOVE_HIGHLIGHT_COLOR = '#00000000';

// Custom icon ejection - these icons have been migrated away from the deprecated Custom / SVG components to native SVG. Please review whether this icon should be contributed to @atlaskit/icon-lab or whether it can be replaced by an existing icon from either @atlaskit/icon or @atlaskit/icon-lab
const DiagonalLineGlyph = (props: ComponentProps<'svg'>) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		style={props.style}
	>
		<rect width="24" height="24" fill="white" fillOpacity="0.01" />
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M17.2038 7.70388C17.5955 8.09565 17.5941 8.73128 17.2005 9.12127L9.1213 17.1277C8.73027 17.5152 8.09958 17.5138 7.71031 17.1245C7.31854 16.7328 7.31997 16.0971 7.71351 15.7071L15.7928 7.70069C16.1838 7.31318 16.8145 7.31461 17.2038 7.70388Z"
			fill="currentColor"
			fillOpacity="0.5"
		/>
	</svg>
);

export const EditorDiagonalLineIcon = () => {
	const { colorMode } = useThemeObserver();
	const primaryColor =
		colorMode === 'dark'
			? token('color.background.accent.gray.bolder', '#626F86')
			: token('color.background.accent.gray.subtle', '#8590A2');
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		<DiagonalLineGlyph aria-label="" style={{ color: primaryColor }} />
	);
};

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * @deprecated Use `highlightColorPaletteNext` instead, which supports both orange and yellow highlight color
 * This will be removed when platform_editor_add_orange_highlight_color is cleaned up
 */
export const highlightColorPalette: Array<PaletteColor> = [
	{
		value: REMOVE_HIGHLIGHT_COLOR,
		label: 'No color' as const, // Mostly informative, only used for analytics
		border: token('color.border', '#091E4224'),
		message: getColorMessage(paletteMessages, 'no-color'),
		decorator: <EditorDiagonalLineIcon />,
	},
];

backgroundColorPalette.forEach((label, color) => {
	highlightColorPalette.push(mapPaletteColor(label, color));
});

export const highlightColorPaletteNext: Array<PaletteColor> = [
	{
		value: REMOVE_HIGHLIGHT_COLOR,
		label: 'No color' as const, // Mostly informative, only used for analytics
		border: token('color.border', '#091E4224'),
		message: getColorMessage(paletteMessages, 'no-color'),
		decorator: <EditorDiagonalLineIcon />,
	},
];

backgroundColorPaletteNext.forEach((label, color) => {
	highlightColorPaletteNext.push(mapPaletteColor(label, color));
});
