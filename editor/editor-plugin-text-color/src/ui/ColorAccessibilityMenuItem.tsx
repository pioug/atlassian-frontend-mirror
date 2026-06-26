import React from 'react';

import type { IntlShape } from 'react-intl';
import { useIntl } from 'react-intl';

import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { colorAccessibilityMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { getTokenCSSVariableValue } from '@atlaskit/editor-common/ui-color';
import {
	hexToEditorTextBackgroundPaletteColor,
	hexToEditorTextPaletteColor,
} from '@atlaskit/editor-palette';
import AccessibilityIcon from '@atlaskit/icon/core/accessibility';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { getTokenValue, token } from '@atlaskit/tokens';

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
		textColor: states.textColorState?.color,
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

	const { defaultColor, highlightColor, textColor } = useColorAccessibilityState(api);
	const contrastRatio = getContrastRatio(defaultColor, highlightColor, textColor);
	if (contrastRatio === null) {
		return <></>;
	}

	const accessibilityStatus = getAccessibilityStatus(contrastRatio);

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
