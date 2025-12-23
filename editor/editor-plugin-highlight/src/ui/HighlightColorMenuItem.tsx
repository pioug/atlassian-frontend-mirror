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
import { ColorPalette, useToolbarDropdownMenu } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import Heading from '@atlaskit/heading';
import EditorDoneIcon from '@atlaskit/icon/core/check-mark';
import Icon from '@atlaskit/icon/core/text-style';
import { fg } from '@atlaskit/platform-feature-flags';
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
		(color: string, event: React.MouseEvent | React.KeyboardEvent) => {
			if (api?.highlight?.commands?.changeColor) {
				api.core.actions.execute(
					api.highlight.commands.changeColor({
						color,
						inputMethod: getInputMethodFromParentKeys(parents),
					}),
				);

				closeMenu?.(event);
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
				decorator: <TextColorIconDecorator label={color.label} isSelected={isSelected(color)} />,
			}));
	}, [activeColor]);

	return (
		<Stack xcss={styles.container} testId="highlight-color-menu-item">
			<Heading size="xxsmall">{formatMessage(messages.highlight)}</Heading>
			<ColorPalette
				onClick={(color, _, event) => {
					handleHighlightColorChange(color, event);
				}}
				selectedColor={activeColor || null}
				paletteOptions={{
					palette: colorPalette || [],
					hexToPaletteColor: hexToEditorTextBackgroundPaletteColor,
				}}
			/>
			{/* moved to editor-plugin-text-color  */}
			{expValEquals('platform_editor_toolbar_aifc_patch_4', 'isEnabled', true) ? undefined : (
				<div css={styles.removeHighlightButton}>
					<Button
						shouldFitContainer
						appearance="subtle"
						onClick={(event: React.MouseEvent) =>
							handleHighlightColorChange(REMOVE_HIGHLIGHT_COLOR, event)
						}
					>
						<Text weight="medium">
							{fg('platform_editor_dec_a11y_fixes')
								? formatMessage(messages.removeHighlight)
								: 'Remove highlight'}
						</Text>
					</Button>
				</div>
			)}
		</Stack>
	);
}
