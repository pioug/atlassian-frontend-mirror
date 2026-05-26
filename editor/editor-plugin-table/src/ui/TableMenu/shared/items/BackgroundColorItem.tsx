/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useMemo } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
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

import { closeActiveTableMenu } from '../../../../pm-plugins/commands';
import { setColorWithAnalytics } from '../../../../pm-plugins/commands/commands-with-analytics';
import { getPluginState } from '../../../../pm-plugins/plugin-factory';
import { useTableMenuContext } from '../TableMenuContext';
import type { TableMenuComponentsParams } from '../types';

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

export const BackgroundColorItem = ({ api }: TableMenuComponentsParams): React.JSX.Element => {
	const { editorView } = useTableMenuContext() ?? {};
	const { formatMessage } = useIntl();
	const selectedColor = useMemo(() => {
		if (!editorView) {
			return '#ffffff';
		}

		const { targetCellPosition } = getPluginState(editorView.state);
		const node = targetCellPosition ? editorView.state.doc.nodeAt(targetCellPosition) : null;

		return hexToEditorBackgroundPaletteColor(node?.attrs?.background || '#ffffff');
	}, [editorView]);

	const onClick = useCallback(
		(color: string) => {
			if (!editorView) {
				return;
			}

			setColorWithAnalytics(api?.analytics?.actions)(
				INPUT_METHOD.TABLE_CONTEXT_MENU,
				color,
				editorView,
			)(editorView.state, editorView.dispatch);
			api?.core.actions.execute(closeActiveTableMenu());
			api?.core.actions.focus();
		},
		[api, editorView],
	);
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	const colorPreviewStyle = useMemo(() => ({ backgroundColor: selectedColor }), [selectedColor]);

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
