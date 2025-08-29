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
import EditorDoneIcon from '@atlaskit/icon/core/migration/check-mark--editor-done';
import Icon from '@atlaskit/icon/core/text-style';
import { Stack, Text, Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { HighlightPlugin } from '../highlightPluginType';

interface HighlightMenuItemProps {
	api: ExtractInjectionAPI<HighlightPlugin> | undefined;
	parents: ToolbarComponentTypes;
}

const styles = cssMap({
	container: {
		marginTop: token('space.200'),
		gap: token('space.075'),
	},
	removeHighlightButton: {
		marginInline: token('space.025'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('radius.small'),
	},
	icon: {
		display: 'inline-block',
		// @ts-expect-error: Intentional negative margin for icon alignment
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space, @atlaskit/ui-styling-standard/no-unsafe-values
		marginLeft: '-1px',
	},
});

const TextColorIconDecorator = ({ label, isSelected }: { isSelected: boolean; label: string }) => {
	const iconColor = token('color.icon', '#000000');
	return isSelected ? (
		<EditorDoneIcon color={iconColor} LEGACY_primaryColor={iconColor} label={label} />
	) : (
		<Box as="span" xcss={styles.icon}>
			<Icon
				label={label}
				color={iconColor}
				shouldRecommendSmallIcon
				spacing="spacious"
				size="small"
			/>
		</Box>
	);
};

export function HighlightColorMenuItem({ api, parents }: HighlightMenuItemProps) {
	const { formatMessage } = useIntl();
	const activeColor = useSharedPluginStateSelector(api, 'highlight.activeColor');
	const context = useToolbarDropdownMenu();
	const closeMenu = context?.closeMenu;

	const handleHighlightColorChange = useCallback(
		(color: string) => {
			if (api?.highlight?.commands?.changeColor) {
				api.core.actions.execute(
					api.highlight.commands.changeColor({
						color,
						inputMethod: getInputMethodFromParentKeys(parents),
					}),
				);

				closeMenu?.();
			}
		},
		[api, closeMenu, parents],
	);

	const colorPalette: PaletteColor[] = useMemo(() => {
		const isSelected = (color: PaletteColor) => color.value === activeColor;
		return highlightColorPaletteNext
			.filter((color) => color.value !== REMOVE_HIGHLIGHT_COLOR)
			.map((color) => ({
				...color,
				decorator: expValEquals('platform_editor_toolbar_aifc_patch_1', 'isEnabled', true) ? (
					<TextColorIconDecorator label={color.label} isSelected={isSelected(color)} />
				) : (
					<TextColorIcon label={color.label} size="small" spacing="spacious" />
				),
			}));
	}, [activeColor]);

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
