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

const NoColorIconDecorator = ({
	isSelected,
	iconColor,
}: {
	iconColor: string;
	isSelected: boolean;
}) => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<g transform="translate(-1 -1)">
			<rect
				x="1.70703"
				y="1.35383"
				width="29.8003"
				height="0.5"
				transform="rotate(45 1.70703 1.35383)"
				stroke={token('color.border')}
				strokeWidth="0.5"
			/>
			{isSelected ? (
				<path
					d="M17.959 7.9707L10.709 16.9707C10.5675 17.1462 10.3544 17.2488 10.1289 17.25C9.90343 17.2512 9.68924 17.1506 9.5459 16.9766L6.0459 12.7266L7.2041 11.7734L10.1182 15.3115L16.791 7.0293L17.959 7.9707Z"
					fill={token('color.icon')}
				/>
			) : (
				<path
					d="M7.80469 16L10.9746 7.26953H12.2637L15.4746 16H14.3027L12.4512 10.8203C12.3379 10.5 12.2051 10.1016 12.0527 9.625C11.9043 9.14453 11.7227 8.5332 11.5078 7.79102H11.7188C11.5078 8.54102 11.3242 9.16016 11.168 9.64844C11.0156 10.1328 10.8887 10.5234 10.7871 10.8203L8.98828 16H7.80469ZM9.39844 13.5625V12.5898H13.8809V13.5625H9.39844Z"
					fill={iconColor}
				/>
			)}
		</g>
	</svg>
);

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
				decorator:
					isNewColorPaletteEnabled && color.value === REMOVE_HIGHLIGHT_COLOR ? (
						<NoColorIconDecorator isSelected={isSelected(color)} iconColor={iconColor} />
					) : (
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
