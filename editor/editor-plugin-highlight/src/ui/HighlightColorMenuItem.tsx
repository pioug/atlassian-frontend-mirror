/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { highlightMessages as messages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
import {
	REMOVE_HIGHLIGHT_COLOR,
	highlightColorPaletteNext,
} from '@atlaskit/editor-common/ui-color';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette';
import { ColorPalette, TextColorIcon, useToolbarDropdownMenu } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { HighlightPlugin } from '../highlightPluginType';

interface HighlightMenuItemProps {
	api: ExtractInjectionAPI<HighlightPlugin> | undefined;
	parents: ToolbarComponentTypes;
}

const styles = cssMap({
	container: {
		marginTop: token('space.200'),
		gap: token('space.100'),
	},
	removeHighlightButton: {
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('border.radius'),
	},
});

export function HighlightColorMenuItem({ api, parents }: HighlightMenuItemProps) {
	const { formatMessage } = useIntl();
	const activeColor = useSharedPluginStateSelector(api, 'highlight.activeColor');
	const { closeMenu } = useToolbarDropdownMenu();

	const handleHighlightColorChange = useCallback(
		(color: string) => {
			if (api?.highlight?.commands?.changeColor) {
				api.core.actions.execute(
					api.highlight.commands.changeColor({
						color,
						inputMethod: getInputMethodFromParentKeys(parents),
					}),
				);

				closeMenu();
			}
		},
		[api, closeMenu, parents],
	);

	const colorPalette: PaletteColor[] = useMemo(
		() =>
			highlightColorPaletteNext
				.filter((color) => color.value !== REMOVE_HIGHLIGHT_COLOR)
				.map((color) => ({
					...color,
					decorator: <TextColorIcon label={color.label} size="small" spacing="spacious" />,
				})),
		[],
	);

	return (
		<Stack xcss={styles.container} testId="highlight-color-menu-item">
			<Text weight="bold">{formatMessage(messages.highlight)}</Text>
			<ColorPalette
				onClick={(color) => {
					handleHighlightColorChange(color);
				}}
				selectedColor={activeColor || null}
				paletteOptions={{
					palette: colorPalette || [],
					hexToPaletteColor: hexToEditorTextBackgroundPaletteColor,
				}}
			/>
			<div css={styles.removeHighlightButton}>
				<Button
					shouldFitContainer
					appearance="subtle"
					onClick={() => handleHighlightColorChange(REMOVE_HIGHLIGHT_COLOR)}
				>
					Remove highlight
				</Button>
			</div>
		</Stack>
	);
}
