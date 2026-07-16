import React from 'react';

import type { IntlShape } from 'react-intl';
import { useIntl } from 'react-intl';

import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { colorAccessibilityMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	getHighlightColorInNonActiveTheme,
	getTextColorInNonActiveTheme,
	getTokenCSSVariableValue,
} from '@atlaskit/editor-common/ui-color';
import {
	hexToEditorTextBackgroundPaletteColor,
	hexToEditorTextPaletteColor,
} from '@atlaskit/editor-palette';
import type { Node } from '@atlaskit/editor-prosemirror/model';
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
	TRANSPARENT_HIGHLIGHT_COLOR,
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

const getBackgroundColor = (highlightColor: string | null | undefined): string => {
	if (!highlightColor || highlightColor === TRANSPARENT_HIGHLIGHT_COLOR) {
		return getTokenValue('elevation.surface', DEFAULT_BACKGROUND_COLOR);
	}

	const colorValue = hexToEditorTextBackgroundPaletteColor(highlightColor) || highlightColor;
	return resolveColorValue(colorValue, highlightColor);
};

const useColorAccessibilityState = (api: ExtractInjectionAPI<TextColorPlugin> | undefined) => {
	return useSharedPluginStateWithSelector(api, ['textColor', 'highlight'], (states) => ({
		defaultColor: states.textColorState?.defaultColor,
		highlightColor: states.highlightState?.activeColor,
		highlightColorInNonActiveTheme: states.highlightState?.activeColorInNonActiveTheme,
		isMultiHighlightColor: states.highlightState?.isMultiHighlightColor,
		isMultiTextColor: states.textColorState?.isMultiTextColor,
		textColor: states.textColorState?.color,
		textColorInNonActiveTheme: states.textColorState?.colorInNonActiveTheme,
	}));
};

const getContrastRatio = (
	defaultColor: string | undefined,
	highlightColor: string | null | undefined,
	textColor: string | null | undefined,
): number | null => {
	try {
		const contrastRatio = calcContrastRatio(
			getForegroundColor(textColor, defaultColor),
			getBackgroundColor(highlightColor),
		);
		return contrastRatio;
	} catch {
		// if we failed to calculate the contrast ratio, return null
		return null;
	}
};

// Computes the contrast ratio for a (textColor, highlightColor) pair as it would
// appear in the non-active theme, using the shared resolvers so the walker
// evaluates the same colors the single-pair plugin-state path does. Returns null
// if it cannot be calculated.
const getNonActiveThemeContrastRatio = (
	defaultColor: string | undefined,
	highlightColor: string | null | undefined,
	textColor: string | null | undefined,
): number | null => {
	try {
		return calcContrastRatio(
			getTextColorInNonActiveTheme(textColor ?? null, defaultColor || DEFAULT_COLOR.color),
			getHighlightColorInNonActiveTheme(highlightColor ?? null, {
				defaultBackgroundColor: DEFAULT_BACKGROUND_COLOR,
				transparentColor: TRANSPARENT_HIGHLIGHT_COLOR,
			}),
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
 * Collects the worst accessibility status across all unique (textColor, highlightColor)
 * combinations in the current selection.
 *
 * When the selection spans multiple text colors and/or highlight colors,
 * this walks the document between selection boundaries and checks every
 * text node's color marks, computing the contrast ratio for each unique pair
 * (across both the active and non-active theme) and returning the worst
 * status found.
 */
const getWorstAccessibilityStatusFromSelection = (
	api: ExtractInjectionAPI<TextColorPlugin> | undefined,
	defaultColor: string | undefined,
): AccessibilityStatusKey | null => {
	if (!api?.core) {
		return null;
	}

	// Track the lowest (worst) contrast ratio across all pairs; a lower ratio
	// means a worse accessibility status, so a single numeric comparison is
	// enough to find the worst pair.
	let worstContrastRatio: number | null = null;

	api.core.actions.execute(({ tr }) => {
		// Text/highlight colors only apply to a text range. If the selection is
		// not a text selection (e.g. a node, cell or all selection) there is no
		// meaningful range of colored text to evaluate.
		if (!(tr.selection instanceof TextSelection)) {
			return null;
		}

		const { from, to } = tr.selection;
		const seen = new Set<string>();

		tr.doc.nodesBetween(from, to, (node: Node) => {
			// Text and highlight color marks only apply to text nodes, so skip
			// any non-text leaves (e.g. emoji, mentions, inline cards). Continue
			// descending into container nodes to reach their text children.
			if (!node.isText) {
				return !node.isLeaf;
			}

			// Extract both color marks in a single pass over the node's marks
			// rather than two `Array.find` scans.
			let textColor: string | null = null;
			let highlightColor: string | null = null;
			for (const mark of node.marks) {
				if (mark.type.name === 'textColor') {
					textColor = mark.attrs.color ?? null;
				} else if (mark.type.name === 'backgroundColor') {
					highlightColor = mark.attrs.color ?? null;
				}
			}

			const pairKey = `${textColor ?? 'default'}|${highlightColor ?? 'default'}`;
			// Skip pairs we have already evaluated so the expensive contrast
			// calculations run at most once per unique (text, highlight) pair.
			if (seen.has(pairKey)) {
				return;
			}
			seen.add(pairKey);

			const contrastRatio = getContrastRatio(defaultColor, highlightColor, textColor);
			if (contrastRatio === null) {
				return;
			}

			// Account for the non-active theme so the worst-case (least
			// accessible) contrast across both themes is used for each pair,
			// keeping multi-color selections consistent with the single-pair path.
			const nonActiveThemeContrastRatio = getNonActiveThemeContrastRatio(
				defaultColor,
				highlightColor,
				textColor,
			);
			const mostCriticalContrastRatio =
				nonActiveThemeContrastRatio !== null
					? Math.min(contrastRatio, nonActiveThemeContrastRatio)
					: contrastRatio;

			if (worstContrastRatio === null || mostCriticalContrastRatio < worstContrastRatio) {
				worstContrastRatio = mostCriticalContrastRatio;
			}
		});

		// Read-only operation — do not dispatch
		return null;
	});

	return worstContrastRatio === null ? null : getAccessibilityStatus(worstContrastRatio);
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
});

export const ColorAccessibilityMenuItem = ({
	api,
}: ColorAccessibilityMenuItemProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const {
		defaultColor,
		highlightColor,
		highlightColorInNonActiveTheme,
		isMultiHighlightColor,
		isMultiTextColor,
		textColor,
		textColorInNonActiveTheme,
	} = useColorAccessibilityState(api);
	// The multi-color selection handling (walking every unique text/highlight
	// pair across the active and non-active theme) is only performed when the
	// patch gate is on. When the gate is off we fall back to the legacy behavior
	// of only evaluating the single active text/highlight color in the current
	// active theme
	const isMultiColorSelection =
		Boolean(isMultiTextColor || isMultiHighlightColor) &&
		fg('platform_editor_lovability_text_bg_color_patch_1');

	// The complement of `isMultiColorSelection`: the single active text/highlight
	// pair is evaluated whenever we are not walking a multi-color selection. This
	// covers both a genuinely single-color selection (gate on) and every
	// selection when the gate is off (legacy behavior).
	const isSingleColorSelection = !isMultiColorSelection;

	// Memoize the selection walk so we don't re-traverse the entire ProseMirror
	// document on every render. It only needs to recompute when the multi-color
	// selection state or the inputs to the walk change (the selection flags,
	// default color, or the plugin api).
	const multiColorStatus = React.useMemo(
		() =>
			isMultiColorSelection ? getWorstAccessibilityStatusFromSelection(api, defaultColor) : null,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[isMultiColorSelection, isMultiTextColor, isMultiHighlightColor, defaultColor, api],
	);

	// The single active text/highlight pair path. Everything below only applies
	// when we are not walking a multi-color selection
	let singleColorStatus: AccessibilityStatusKey | null = null;
	if (isSingleColorSelection) {
		const singleColorContrastRatio = getContrastRatio(defaultColor, highlightColor, textColor);

		// Also account for the non-active theme (gate on only) so the worst-case
		// (least accessible) status across both themes is shown.
		let nonActiveThemeSingleColorRatio: number | null = null;
		if (
			textColorInNonActiveTheme &&
			highlightColorInNonActiveTheme &&
			fg('platform_editor_lovability_text_bg_color_patch_1')
		) {
			try {
				nonActiveThemeSingleColorRatio = calcContrastRatio(
					textColorInNonActiveTheme,
					highlightColorInNonActiveTheme,
				);
			} catch {
				// if we failed to calculate the contrast ratio, leave as null
				nonActiveThemeSingleColorRatio = null;
			}
		}

		const mostCriticalContrastRatio =
			singleColorContrastRatio !== null && nonActiveThemeSingleColorRatio !== null
				? Math.min(singleColorContrastRatio, nonActiveThemeSingleColorRatio)
				: singleColorContrastRatio;

		singleColorStatus =
			mostCriticalContrastRatio !== null ? getAccessibilityStatus(mostCriticalContrastRatio) : null;
	}

	const accessibilityStatus: AccessibilityStatusKey | null = isSingleColorSelection
		? singleColorStatus
		: multiColorStatus;

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
		<Box xcss={styles.container}>
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
