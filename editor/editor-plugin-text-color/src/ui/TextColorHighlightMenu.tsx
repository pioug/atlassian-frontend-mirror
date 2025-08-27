import React from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { textColorMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette';
import {
	TextColorIcon,
	ToolbarColorSwatch,
	ToolbarDropdownMenu,
	ToolbarTooltip,
	getContrastingBackgroundColor,
} from '@atlaskit/editor-toolbar';
import { Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';
import { type IconColor } from '@atlaskit/tokens/css-type-schema';

import type { TextColorPlugin } from '../textColorPluginType';

const styles = cssMap({
	menu: {
		paddingBlock: token('space.025'),
		paddingInline: token('space.100'),
	},
});

interface TextColorHighlightMenuProps {
	api: ExtractInjectionAPI<TextColorPlugin> | undefined;
	children: React.ReactNode;
}

const getIconColor = (
	textColor: string | null | undefined,
	defaultColor: string | null | undefined,
	highlightColor: string | null | undefined,
): string => {
	if (highlightColor || !textColor || (textColor === defaultColor && defaultColor)) {
		return token('color.text');
	}

	return hexToEditorTextPaletteColor(textColor) || token('color.text');
};

export const TextColorHighlightMenu = ({ children, api }: TextColorHighlightMenuProps) => {
	const isHighlightPluginExisted = !!api?.highlight;
	const isTextColorDisabled = useSharedPluginStateSelector(api, 'textColor.disabled');
	const highlightColor = useSharedPluginStateSelector(api, 'highlight.activeColor');
	const textColor = useSharedPluginStateSelector(api, 'textColor.color');
	const { formatMessage } = useIntl();
	const defaultColor = useSharedPluginStateSelector(api, 'textColor.defaultColor');
	const iconColor = getIconColor(textColor, defaultColor, highlightColor);
	const highlightColorIcon = highlightColor
		? highlightColor
		: getContrastingBackgroundColor(iconColor);

	return expValEquals('platform_editor_toolbar_aifc_patch_1', 'isEnabled', true) ? (
		<ToolbarTooltip
			content={formatMessage(
				isHighlightPluginExisted ? messages.textColorHighlightTooltip : messages.textColorTooltip,
			)}
		>
			<ToolbarDropdownMenu
				iconBefore={
					<ToolbarColorSwatch highlightColor={highlightColorIcon}>
						<TextColorIcon
							label={formatMessage(messages.textColorTooltip)}
							iconColor={iconColor as IconColor}
							shouldRecommendSmallIcon
							size={'small'}
							isDisabled={isTextColorDisabled}
							spacing={'compact'}
						/>
					</ToolbarColorSwatch>
				}
				isDisabled={isTextColorDisabled}
				testId="text-color-highlight-menu"
				hasSectionMargin={false}
			>
				<Box xcss={styles.menu}>{children}</Box>
			</ToolbarDropdownMenu>
		</ToolbarTooltip>
	) : (
		<ToolbarDropdownMenu
			iconBefore={
				<ToolbarColorSwatch highlightColor={highlightColor || ''}>
					<TextColorIcon
						label={formatMessage(messages.textColorTooltip)}
						iconColor={(textColor || token('color.text.accent.magenta')) as IconColor}
						shouldRecommendSmallIcon={true}
						size={'small'}
						isDisabled={isTextColorDisabled}
						spacing={'compact'}
					/>
				</ToolbarColorSwatch>
			}
			isDisabled={isTextColorDisabled}
			testId="text-color-highlight-menu"
			hasSectionMargin={false}
		>
			<Box xcss={styles.menu}>{children}</Box>
		</ToolbarDropdownMenu>
	);
};
