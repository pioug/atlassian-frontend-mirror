/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import { highlightMessages as messages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	REMOVE_HIGHLIGHT_COLOR,
	highlightColorPalette,
	highlightColorPaletteNew,
	type PaletteColor,
	useSelectedTextColor,
} from '@atlaskit/editor-common/ui-color';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import {
	hexToEditorTextBackgroundPaletteColor,
	hexToEditorTextPaletteColor,
} from '@atlaskit/editor-palette';
import { ColorPalette, useToolbarDropdownMenu } from '@atlaskit/editor-toolbar';
import type { ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import Heading from '@atlaskit/heading';
import EditorDoneIcon from '@atlaskit/icon/core/check-mark';
import Icon from '@atlaskit/icon/core/text-style';
import { Stack, Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';
import type { IconColor } from '@atlaskit/tokens/css-type-schema';

import type { HighlightPlugin } from '../highlightPluginType';

interface HighlightMenuItemProps {
	api: ExtractInjectionAPI<HighlightPlugin> | undefined;
	parents: ToolbarComponentTypes;
}

const HIGHLIGHT_COLOR_PICKER_COLUMNS = 10;

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

const getTextColorIconColor = (
	defaultColor: string | null | undefined,
	textColor: string | null | undefined,
	isNewColorPaletteEnabled: boolean,
) => {
	if (!isNewColorPaletteEnabled) {
		return token('color.icon');
	}

	if (!textColor || (defaultColor && textColor === defaultColor)) {
		return token('color.icon');
	}

	return hexToEditorTextPaletteColor(textColor) || token('color.icon');
};

const TextColorIconDecorator = ({
	label,
	isSelected,
	iconColor,
}: {
	iconColor: string;
	isSelected: boolean;
	label: string;
}) => {
	return isSelected ? (
		<EditorDoneIcon color={token('color.icon')} label={label} />
	) : (
		<Box as="span" xcss={styles.icon}>
			<Icon
				label={label}
				color={iconColor as IconColor}
				shouldRecommendSmallIcon
				spacing="spacious"
				size="small"
			/>
		</Box>
	);
};

export function HighlightColorMenuItem({ api, parents }: HighlightMenuItemProps): JSX.Element {
	const { formatMessage } = useIntl();
	const activeColor = useSharedPluginStateSelector(api, 'highlight.activeColor');
	const context = useToolbarDropdownMenu();
	const { textColor, defaultColor } = useSelectedTextColor();
	const closeMenu = context?.closeMenu;

	const isNewColorPaletteEnabled = expValEquals(
		'platform_editor_lovability_text_bg_color',
		'isEnabled',
		true,
	);

	const selectedColor = activeColor || (isNewColorPaletteEnabled ? REMOVE_HIGHLIGHT_COLOR : null);

	const handleHighlightColorChange = useCallback(
		(color: string, event: React.MouseEvent | React.KeyboardEvent) => {
			if (api?.highlight?.commands?.changeColor) {
				api.core.actions.execute(
					api.highlight.commands.changeColor({
						color,
						inputMethod: getInputMethodFromParentKeys(parents),
					}),
				);

				if (!isNewColorPaletteEnabled) {
					closeMenu?.(event);
				}
			}
		},
		[api, closeMenu, isNewColorPaletteEnabled, parents],
	);

	const colorPalette: PaletteColor[] = useMemo(() => {
		const isSelected = (color: PaletteColor) => color.value === selectedColor;
		const iconColor = getTextColorIconColor(defaultColor, textColor, isNewColorPaletteEnabled);

		const highlightPalette = isNewColorPaletteEnabled
			? highlightColorPaletteNew
			: highlightColorPalette;

		return highlightPalette
			.filter((color) => isNewColorPaletteEnabled || color.value !== REMOVE_HIGHLIGHT_COLOR)
			.map((color) => ({
				...color,
				decorator: (
					<TextColorIconDecorator
						label={color.label}
						isSelected={isSelected(color)}
						iconColor={iconColor}
					/>
				),
			}));
	}, [defaultColor, textColor, isNewColorPaletteEnabled, selectedColor]);

	return (
		<Stack xcss={styles.container} testId="highlight-color-menu-item">
			<Heading size="xxsmall">{formatMessage(messages.highlight)}</Heading>
			<ColorPalette
				cols={isNewColorPaletteEnabled ? HIGHLIGHT_COLOR_PICKER_COLUMNS : undefined}
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				onClick={(color, _, event) => {
					handleHighlightColorChange(color, event);
				}}
				selectedColor={selectedColor}
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
				paletteOptions={{
					palette: colorPalette || [],
					hexToPaletteColor: hexToEditorTextBackgroundPaletteColor,
				}}
			/>
		</Stack>
	);
}
