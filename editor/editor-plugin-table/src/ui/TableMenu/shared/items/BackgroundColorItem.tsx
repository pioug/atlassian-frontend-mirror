/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useMemo } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import {
	backgroundPaletteTooltipMessages,
	cellBackgroundColorPalette,
	ColorPalette,
} from '@atlaskit/editor-common/ui-color';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import {
	NestedDropdownRightIcon,
	PaintBucketIcon,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const colorPaletteColumns = 7;

const colorPaletteStyles = cssMap({
	container: {
		paddingBlock: token('space.100'),
	},
	elemAfter: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
	},
	colorPreview: {
		width: '14px',
		height: '14px',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		flexShrink: 0,
	},
});

export const BackgroundColorItem = (): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const onClick = useCallback(() => {}, []);
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	const colorPreviewStyle = useMemo(() => ({ backgroundColor: '#ffffff' }), []);

	const paletteOptions = useMemo(() => {
		return {
			palette: cellBackgroundColorPalette,
			paletteColorTooltipMessages: backgroundPaletteTooltipMessages,
			hexToPaletteColor: hexToEditorBackgroundPaletteColor,
		};
	}, []);

	return (
		<ToolbarNestedDropdownMenu
			elemBefore={<PaintBucketIcon color="currentColor" label="" size="small" />}
			elemAfter={
				<Box xcss={colorPaletteStyles.elemAfter}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop */}
					<div css={colorPaletteStyles.colorPreview} style={colorPreviewStyle} />
					<NestedDropdownRightIcon label="" size="small" />
				</Box>
			}
			text={formatMessage(messages.backgroundColor)}
		>
			<Box xcss={colorPaletteStyles.container}>
				<ColorPalette
					cols={colorPaletteColumns}
					onClick={onClick}
					selectedColor={colorPreviewStyle.backgroundColor}
					paletteOptions={paletteOptions}
				/>
			</Box>
		</ToolbarNestedDropdownMenu>
	);
};
