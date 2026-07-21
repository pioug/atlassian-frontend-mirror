import React from 'react';

import type { IntlShape } from 'react-intl';
import { useIntl } from 'react-intl';

import { PanelType } from '@atlaskit/adf-schema/panel';
import { IconButton } from '@atlaskit/button/new';
import { cssMap, cx } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { colorAccessibilityMessages as messages } from '@atlaskit/editor-common/messages';
import { getPanelTypeBackgroundNoTokens } from '@atlaskit/editor-common/panel';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	getTextColorInNonActiveTheme,
	getTokenCSSVariableValue,
	getTokenCSSVariableValueForNonActiveTheme,
} from '@atlaskit/editor-common/ui-color';
import {
	hexToEditorBackgroundPaletteColor,
	hexToEditorTextBackgroundPaletteColor,
	hexToEditorTextPaletteColor,
} from '@atlaskit/editor-palette';
import type { Node, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import AccessibilityIcon from '@atlaskit/icon/core/accessibility';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { getTokenValue } from '@atlaskit/tokens/get-token-value';

import { getContrastRatio as calcContrastRatio } from '../pm-plugins/utils/color-contrast';
import {
	DEFAULT_COLOR,
	DEFAULT_BACKGROUND_COLOR,
	ACCESSIBLE_CONTRAST_RATIO,
	DIFFICULT_CONTRAST_RATIO,
} from '../pm-plugins/utils/constants';
import type { TextColorPlugin } from '../textColorPluginType';

type ColorAccessibilityMenuItemProps = {
	api: ExtractInjectionAPI<TextColorPlugin> | undefined;
};

const resolveColorValue = (color: string, fallback: string): string => {
	return getTokenCSSVariableValue(color) || (color.startsWith('var(') ? fallback : color);
};

const getForegroundColor = (
	textColor: string | null | undefined,
	defaultColor: string | null | undefined,
): string => {
	if (!textColor || (defaultColor && textColor === defaultColor)) {
		return getTokenValue('color.text', defaultColor || DEFAULT_COLOR.color);
	}

	const colorValue = hexToEditorTextPaletteColor(textColor) || textColor;
	return resolveColorValue(colorValue, textColor);
};

const getBackgroundColor = (
	backgroundColor: string | null | undefined,
	palette: 'text' | 'element' = 'text',
): string => {
	if (!backgroundColor || backgroundColor === 'none') {
		return getTokenValue('elevation.surface', DEFAULT_BACKGROUND_COLOR);
	}

	const colorValue =
		palette === 'element'
			? hexToEditorBackgroundPaletteColor(backgroundColor) || backgroundColor
			: hexToEditorTextBackgroundPaletteColor(backgroundColor) || backgroundColor;
	return resolveColorValue(colorValue, backgroundColor);
};

const getBackgroundColorInNonActiveTheme = (
	backgroundColor: string | null | undefined,
	palette: 'text' | 'element' = 'text',
): string => {
	if (!backgroundColor || backgroundColor === 'none') {
		return getTokenCSSVariableValueForNonActiveTheme(
			token('elevation.surface'),
			DEFAULT_BACKGROUND_COLOR,
		);
	}

	const colorValue =
		palette === 'element'
			? hexToEditorBackgroundPaletteColor(backgroundColor) || backgroundColor
			: hexToEditorTextBackgroundPaletteColor(backgroundColor) || backgroundColor;
	return getTokenCSSVariableValueForNonActiveTheme(colorValue, backgroundColor);
};

type BackgroundColorSource = 'element' | 'text';

export type ResolvedBackgroundColor = {
	color: string | null;
	source: BackgroundColorSource;
};

type ColorAccessibilityEditorState = Pick<EditorState, 'doc' | 'selection'>;

const STANDARD_PANEL_BACKGROUND_COLORS = new Map<string, string>([
	[PanelType.INFO, getPanelTypeBackgroundNoTokens(PanelType.INFO)],
	[PanelType.NOTE, getPanelTypeBackgroundNoTokens(PanelType.NOTE)],
	[PanelType.SUCCESS, getPanelTypeBackgroundNoTokens(PanelType.SUCCESS)],
	[PanelType.WARNING, getPanelTypeBackgroundNoTokens(PanelType.WARNING)],
	[PanelType.ERROR, getPanelTypeBackgroundNoTokens(PanelType.ERROR)],
]);

const getResolvedBackgroundFromHighlight = (
	highlightColor: string | null | undefined,
): ResolvedBackgroundColor => {
	if (!highlightColor) {
		return { color: null, source: 'text' };
	}

	return { color: highlightColor, source: 'text' };
};

/**
 * Resolves a background color from a container node that paints behind text.
 * Callers walk ancestors so the nearest painted container wins.
 */
const getSupportedAncestorBackgroundColor = (node: Node): ResolvedBackgroundColor | null => {
	let backgroundColor: string | undefined;

	if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
		backgroundColor = node.attrs.background;
	} else if (node.type.name === 'panel' || node.type.name === 'panel_c1') {
		if (node.attrs.panelType === PanelType.CUSTOM) {
			backgroundColor = node.attrs.panelColor;
		} else {
			backgroundColor = STANDARD_PANEL_BACKGROUND_COLORS.get(node.attrs.panelType);
		}
	}

	return backgroundColor ? { color: backgroundColor, source: 'element' } : null;
};

/**
 * Resolves the visible background behind a text node.
 * Text highlight wins before falling back to the nearest element background.
 */
export const getResolvedBackgroundColorForTextNode = (
	$pos: ResolvedPos,
	node: Node,
): ResolvedBackgroundColor => {
	for (const mark of node.marks) {
		if (mark.type.name === 'backgroundColor' && mark.attrs.color) {
			return { color: mark.attrs.color, source: 'text' };
		}
	}

	for (let depth = $pos.depth; depth > 0; depth--) {
		const resolvedBackgroundColor = getSupportedAncestorBackgroundColor($pos.node(depth));
		if (resolvedBackgroundColor) {
			return resolvedBackgroundColor;
		}
	}

	return { color: null, source: 'text' };
};

const getResolvedBackgroundColorForPosition = (
	$pos: ResolvedPos,
	highlightColor: string | null | undefined,
): ResolvedBackgroundColor => {
	const highlightBackground = getResolvedBackgroundFromHighlight(highlightColor);
	if (highlightColor) {
		return highlightBackground;
	}

	for (let depth = $pos.depth; depth > 0; depth--) {
		const resolvedBackgroundColor = getSupportedAncestorBackgroundColor($pos.node(depth));
		if (resolvedBackgroundColor) {
			return resolvedBackgroundColor;
		}
	}

	return highlightBackground;
};

const getResolvedBackgroundColorValue = (backgroundColor: ResolvedBackgroundColor): string => {
	if (backgroundColor.source === 'element') {
		return getBackgroundColor(backgroundColor.color, 'element');
	}

	return getBackgroundColor(backgroundColor.color);
};

const getResolvedBackgroundColorValueInNonActiveTheme = (
	backgroundColor: ResolvedBackgroundColor,
): string => {
	if (backgroundColor.source === 'element') {
		return getBackgroundColorInNonActiveTheme(backgroundColor.color, 'element');
	}

	return getBackgroundColorInNonActiveTheme(backgroundColor.color);
};

const useColorAccessibilityState = (api: ExtractInjectionAPI<TextColorPlugin> | undefined) => {
	return useSharedPluginStateWithSelector(api, ['textColor', 'highlight'], (states) => ({
		defaultColor: states.textColorState?.defaultColor,
		highlightColor: states.highlightState?.activeColor,
		textColor: states.textColorState?.color,
	}));
};

const getContrastRatio = (
	defaultColor: string | undefined,
	backgroundColor: ResolvedBackgroundColor,
	textColor: string | null | undefined,
): number | null => {
	try {
		const contrastRatio = calcContrastRatio(
			getForegroundColor(textColor, defaultColor),
			getResolvedBackgroundColorValue(backgroundColor),
		);
		return contrastRatio;
	} catch {
		// if we failed to calculate the contrast ratio, return null
		return null;
	}
};

// Computes the contrast ratio as it would appear in the non-active theme.
const getNonActiveThemeContrastRatio = (
	defaultColor: string | undefined,
	backgroundColor: ResolvedBackgroundColor,
	textColor: string | null | undefined,
): number | null => {
	try {
		return calcContrastRatio(
			getTextColorInNonActiveTheme(textColor ?? null, defaultColor || DEFAULT_COLOR.color),
			getResolvedBackgroundColorValueInNonActiveTheme(backgroundColor),
		);
	} catch {
		// if we failed to calculate the contrast ratio, return null
		return null;
	}
};

type AccessibilityStatusKey = 'accessible' | 'difficultToRead' | 'inaccessible';

const getAccessibilityStatus = (contrastRatio: number): AccessibilityStatusKey => {
	if (contrastRatio >= ACCESSIBLE_CONTRAST_RATIO) {
		return 'accessible';
	} else if (contrastRatio >= DIFFICULT_CONTRAST_RATIO) {
		return 'difficultToRead';
	} else {
		return 'inaccessible';
	}
};

/**
 * Computes status from active foreground/background colors only.
 * Used by the gate-off path so legacy behavior stays isolated.
 */
const getAccessibilityStatusFromColorPair = (
	defaultColor: string | undefined,
	backgroundColor: ResolvedBackgroundColor,
	textColor: string | null | undefined,
): AccessibilityStatusKey | null => {
	const contrastRatio = getContrastRatio(defaultColor, backgroundColor, textColor);

	return contrastRatio === null ? null : getAccessibilityStatus(contrastRatio);
};

/**
 * Returns the lowest contrast ratio across active and non-active themes.
 */
const getMostCriticalContrastRatioAcrossThemes = (
	defaultColor: string | undefined,
	backgroundColor: ResolvedBackgroundColor,
	textColor: string | null | undefined,
): number | null => {
	const contrastRatio = getContrastRatio(defaultColor, backgroundColor, textColor);
	const nonActiveThemeContrastRatio = getNonActiveThemeContrastRatio(
		defaultColor,
		backgroundColor,
		textColor,
	);

	if (contrastRatio !== null && nonActiveThemeContrastRatio !== null) {
		return Math.min(contrastRatio, nonActiveThemeContrastRatio);
	}

	return contrastRatio;
};

const getAccessibilityStatusFromColorPairAcrossThemes = (
	defaultColor: string | undefined,
	backgroundColor: ResolvedBackgroundColor,
	textColor: string | null | undefined,
): AccessibilityStatusKey | null => {
	const mostCriticalContrastRatio = getMostCriticalContrastRatioAcrossThemes(
		defaultColor,
		backgroundColor,
		textColor,
	);

	return mostCriticalContrastRatio === null
		? null
		: getAccessibilityStatus(mostCriticalContrastRatio);
};

/**
 * Collects the worst accessibility status across all unique foreground/background
 * combinations in the current selection.
 *
 * When the selection spans multiple text colors and/or resolved backgrounds,
 * this checks each unique pair across both the active and non-active theme and
 * returns the worst status found.
 */
const getWorstAccessibilityStatusFromEditorState = (
	state: ColorAccessibilityEditorState,
	defaultColor: string | undefined,
): AccessibilityStatusKey | null => {
	let worstContrastRatio: number | null = null;

	// Text/highlight colors only apply to a text range. If the selection is
	// not a text selection (e.g. a node, cell or all selection) there is no
	// meaningful range of colored text to evaluate.
	if (!(state.selection instanceof TextSelection) || state.selection.empty) {
		return null;
	}

	const { from, to } = state.selection;
	const seen = new Set<string>();

	state.doc.nodesBetween(from, to, (node: Node, pos: number) => {
		if (!node.isText) {
			return !node.isLeaf;
		}

		let textColor: string | null = null;
		for (const mark of node.marks) {
			if (mark.type.name === 'textColor') {
				textColor = mark.attrs.color ?? null;
			}
		}

		const backgroundColor = getResolvedBackgroundColorForTextNode(state.doc.resolve(pos), node);
		const pairKey = `${textColor ?? 'default'}|${backgroundColor.source}|${
			backgroundColor.color ?? 'default'
		}`;
		// Skip foreground/background pairs already evaluated. The source is
		// part of the key because text highlights and element backgrounds use
		// different editor palettes.
		if (seen.has(pairKey)) {
			return;
		}
		seen.add(pairKey);

		const mostCriticalContrastRatio = getMostCriticalContrastRatioAcrossThemes(
			defaultColor,
			backgroundColor,
			textColor,
		);
		if (mostCriticalContrastRatio === null) {
			return;
		}
		if (worstContrastRatio === null || mostCriticalContrastRatio < worstContrastRatio) {
			worstContrastRatio = mostCriticalContrastRatio;
		}
	});

	return worstContrastRatio === null ? null : getAccessibilityStatus(worstContrastRatio);
};

export const getAccessibilityStatusForCurrentSelection = (
	state: ColorAccessibilityEditorState,
	defaultColor: string | undefined,
	highlightColor: string | null | undefined,
	textColor: string | null | undefined,
): AccessibilityStatusKey | null => {
	if (state.selection instanceof TextSelection) {
		if (!state.selection.empty) {
			return getWorstAccessibilityStatusFromEditorState(state, defaultColor);
		}

		return getAccessibilityStatusFromColorPairAcrossThemes(
			defaultColor,
			getResolvedBackgroundColorForPosition(state.selection.$from, highlightColor),
			textColor,
		);
	}

	return null;
};

const AccessibilityStatus = ({
	accessibilityStatus,
	formatMessage,
}: {
	accessibilityStatus: AccessibilityStatusKey;
	formatMessage: IntlShape['formatMessage'];
}): React.JSX.Element => {
	if (accessibilityStatus === 'accessible') {
		return (
			<Text as="span" size="small" color="color.text.success">
				{formatMessage(messages.accessibleLabel)}
			</Text>
		);
	} else if (accessibilityStatus === 'difficultToRead') {
		return (
			<Text as="span" size="small" color="color.text.warning">
				{formatMessage(messages.difficultToReadLabel)}
			</Text>
		);
	} else {
		return (
			<Text as="span" size="small" color="color.text.danger">
				{formatMessage(messages.inaccessibleLabel)}
			</Text>
		);
	}
};

const styles = cssMap({
	container: {
		border: 'none',
		marginTop: token('space.100'),
		paddingTop: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.100'),
		paddingRight: token('space.050'),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	// Merge these overrides back into container when cleaning up
	// platform_editor_lovability_text_bg_color_patch_1.
	containerPatch: {
		marginTop: token('space.0'),
		paddingTop: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		paddingRight: token('space.0'),
	},
});

export const ColorAccessibilityMenuItem = ({
	api,
}: ColorAccessibilityMenuItemProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const { defaultColor, highlightColor, textColor } = useColorAccessibilityState(api);
	const { editorView } = useEditorToolbar();
	const editorState = editorView?.state;
	const accessibilityStatus = React.useMemo<AccessibilityStatusKey | null>(
		() =>
			editorState && fg('platform_editor_lovability_text_bg_color_patch_1')
				? getAccessibilityStatusForCurrentSelection(
						editorState,
						defaultColor,
						highlightColor,
						textColor,
					)
				: getAccessibilityStatusFromColorPair(
						defaultColor,
						getResolvedBackgroundFromHighlight(highlightColor),
						textColor,
					),
		[defaultColor, editorState, highlightColor, textColor],
	);

	if (accessibilityStatus === null) {
		return <></>;
	}

	const tooltipContent = (accessibilityStatus: AccessibilityStatusKey) => {
		if (accessibilityStatus === 'accessible') {
			return formatMessage(messages.accessibleTooltip);
		} else if (accessibilityStatus === 'difficultToRead') {
			return formatMessage(messages.difficultToReadTooltip);
		} else {
			return formatMessage(messages.inaccessibleTooltip);
		}
	};

	return (
		<Box
			xcss={cx(
				styles.container,
				fg('platform_editor_lovability_text_bg_color_patch_1') && styles.containerPatch,
			)}
		>
			<Inline alignBlock="center" space="space.050">
				<AccessibilityIcon
					label=""
					size="medium"
					color={
						fg('platform_editor_lovability_text_bg_color_patch_1')
							? token('color.icon.subtle')
							: undefined
					}
				/>
				<Text as="span" size="small" color="color.text.subtle">
					{formatMessage(messages.accessibility)}
				</Text>
				<Text as="span" size="small" color="color.text.subtle" aria-hidden="true">
					•
				</Text>
				<AccessibilityStatus
					accessibilityStatus={accessibilityStatus}
					formatMessage={formatMessage}
				/>
			</Inline>
			<IconButton
				icon={QuestionCircleIcon}
				shape="circle"
				label={tooltipContent(accessibilityStatus)}
				isTooltipDisabled={false}
				spacing="compact"
				appearance="subtle"
			/>
		</Box>
	);
};
