import React, { useCallback, useEffect } from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { toggleHighlightPalette, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { textColorMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import {
	hexToEditorTextPaletteColor,
	hexToEditorTextBackgroundPaletteColor,
} from '@atlaskit/editor-palette';
import {
	TextColorIcon,
	ToolbarColorSwatch,
	ToolbarDropdownMenu,
	ToolbarDropdownMenuProvider,
	ToolbarTooltip,
	useToolbarUI,
} from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';
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

const getHighlightColorIcon = (highlightColor: string | null | undefined) => {
	if (highlightColor) {
		return hexToEditorTextBackgroundPaletteColor(highlightColor);
	}
	return undefined;
};

export const TextColorHighlightMenu = ({ children, api }: TextColorHighlightMenuProps): React.JSX.Element => {
	const isHighlightPluginExisted = !!api?.highlight;
	const isTextColorDisabled = useSharedPluginStateSelector(api, 'textColor.disabled');
	const { isDisabled: isToolbarDisabled } = useToolbarUI();
	const isDisabled = Boolean(isToolbarDisabled || isTextColorDisabled);
	const highlightColor = useSharedPluginStateSelector(api, 'highlight.activeColor');
	const textColor = useSharedPluginStateSelector(api, 'textColor.color');
	const { formatMessage } = useIntl();
	const defaultColor = useSharedPluginStateSelector(api, 'textColor.defaultColor');
	const isPaletteOpen = useSharedPluginStateSelector(api, 'textColor.isPaletteOpen');

	const setIsPaletteOpen = useCallback(
		(isOpen: boolean) => {
			if (api?.textColor?.commands?.setPalette) {
				api.core.actions.execute(({ tr }) => {
					api.textColor.commands.setPalette(isOpen)({ tr });
					return tr;
				});
			}
		},
		[api?.textColor?.commands, api?.core.actions],
	);

	useEffect(() => {
		return () => {
			if (
				expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true) &&
				fg('platform_editor_toolbar_aifc_patch_7')
			) {
				if (isPaletteOpen) {
					setIsPaletteOpen(false);
				}
			}
		};
	}, [setIsPaletteOpen, isPaletteOpen]);

	const iconColor = getIconColor(textColor, defaultColor, highlightColor);

	return (
		<ToolbarTooltip
			content={
				<ToolTipContent
					description={formatMessage(
						isHighlightPluginExisted
							? messages.textColorHighlightTooltip
							: messages.textColorTooltip,
					)}
					keymap={toggleHighlightPalette}
				/>
			}
		>
			<ToolbarDropdownMenuProvider
				isOpen={
					expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true)
						? isPaletteOpen
						: undefined
				}
				setIsOpen={
					expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true)
						? setIsPaletteOpen
						: undefined
				}
			>
				<ToolbarDropdownMenu
					iconBefore={
						<ToolbarColorSwatch highlightColor={getHighlightColorIcon(highlightColor)}>
							<TextColorIcon
								label={formatMessage(messages.textColorTooltip)}
								iconColor={iconColor as IconColor}
								shouldRecommendSmallIcon
								size={'small'}
								isDisabled={isDisabled}
								spacing={'compact'}
							/>
						</ToolbarColorSwatch>
					}
					isDisabled={isDisabled}
					testId="text-color-highlight-menu"
					hasSectionMargin={false}
				>
					{expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true) ? (
						children
					) : (
						<Box xcss={styles.menu}>{children}</Box>
					)}
				</ToolbarDropdownMenu>
			</ToolbarDropdownMenuProvider>
		</ToolbarTooltip>
	);
};
