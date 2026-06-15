import React, { useCallback, useEffect, useRef } from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toggleHighlightPalette, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { textColorMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { SelectedTextColorProvider } from '@atlaskit/editor-common/ui-color';
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
import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';
import type { IconColor } from '@atlaskit/tokens/css-type-schema';

import type { TextColorPlugin } from '../textColorPluginType';

interface TextColorHighlightMenuProps {
	api: ExtractInjectionAPI<TextColorPlugin> | undefined;
	children: React.ReactNode;
}

const getIconColor = (
	textColor: string | null | undefined,
	defaultColor: string | null | undefined,
	highlightColor: string | null | undefined,
): string => {
	if (expValEquals('platform_editor_lovability_text_bg_color', 'isEnabled', true)) {
		if (!textColor || (textColor === defaultColor && defaultColor)) {
			return token('color.text');
		}

		return hexToEditorTextPaletteColor(textColor) || token('color.text');
	}

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

type TextColorHighlightMenuState = {
	defaultColor?: string | null;
	highlightColor?: string | null;
	isPaletteOpen?: boolean;
	isTextColorDisabled?: boolean;
	textColor?: string | null;
};

const useTextColorHighlightMenuStateNew = (
	api: ExtractInjectionAPI<TextColorPlugin> | undefined,
): TextColorHighlightMenuState => {
	return useSharedPluginStateWithSelector(
		api,
		['textColor', 'highlight', 'interaction'],
		(states) => {
			const useDefaultToolbarState =
				states.interactionState?.interactionState === 'hasNotHadInteraction';

			return {
				isTextColorDisabled: states.textColorState?.disabled,
				textColor: states.textColorState?.color,
				defaultColor: states.textColorState?.defaultColor,
				isPaletteOpen: states.textColorState?.isPaletteOpen,
				highlightColor: useDefaultToolbarState ? undefined : states.highlightState?.activeColor,
			};
		},
	);
};

const useTextColorHighlightMenuStateOld = (
	api: ExtractInjectionAPI<TextColorPlugin> | undefined,
): TextColorHighlightMenuState => {
	const isTextColorDisabled = useSharedPluginStateSelector(api, 'textColor.disabled');
	const textColor = useSharedPluginStateSelector(api, 'textColor.color');
	const defaultColor = useSharedPluginStateSelector(api, 'textColor.defaultColor');
	const isPaletteOpen = useSharedPluginStateSelector(api, 'textColor.isPaletteOpen');
	const highlightColor = useSharedPluginStateSelector(api, 'highlight.activeColor');

	return {
		isTextColorDisabled,
		textColor,
		defaultColor,
		isPaletteOpen,
		highlightColor,
	};
};

const useTextColorHighlightMenuState: (
	api: ExtractInjectionAPI<TextColorPlugin> | undefined,
) => TextColorHighlightMenuState = conditionalHooksFactory(
	() => expValEquals('platform_editor_default_toolbar_state', 'isEnabled', true),
	useTextColorHighlightMenuStateNew,
	useTextColorHighlightMenuStateOld,
);

export const TextColorHighlightMenu = ({
	children,
	api,
}: TextColorHighlightMenuProps): React.JSX.Element => {
	const isHighlightPluginExisted = !!api?.highlight;
	const { isDisabled: isToolbarDisabled } = useToolbarUI();
	const { isTextColorDisabled, textColor, defaultColor, isPaletteOpen, highlightColor } =
		useTextColorHighlightMenuState(api);
	const isDisabled = Boolean(isToolbarDisabled || isTextColorDisabled);
	const { formatMessage } = useIntl();

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

	// use isPaletteOpenRef to "close" the palette on unmount, and not on state changes
	const isPaletteOpenRef = useRef(isPaletteOpen);
	isPaletteOpenRef.current = isPaletteOpen;

	useEffect(() => {
		return () => {
			if (expValEquals('platform_editor_lovability_text_bg_color', 'isEnabled', true)) {
				if (isPaletteOpenRef.current) {
					setIsPaletteOpen(false);
				}
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		return () => {
			if (expValEquals('platform_editor_lovability_text_bg_color', 'isEnabled', true)) {
				return;
			}
			if (isPaletteOpen) {
				setIsPaletteOpen(false);
			}
		};
	}, [setIsPaletteOpen, isPaletteOpen]);

	const iconColor = getIconColor(textColor, defaultColor, highlightColor);

	if (expValEquals('platform_editor_lovability_text_bg_color', 'isEnabled', true)) {
		return (
			<ToolbarDropdownMenuProvider isOpen={isPaletteOpen} setIsOpen={setIsPaletteOpen}>
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
					tooltipComponent={
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
						/>
					}
				>
					<SelectedTextColorProvider textColor={textColor} defaultColor={defaultColor}>
						{children}
					</SelectedTextColorProvider>
				</ToolbarDropdownMenu>
			</ToolbarDropdownMenuProvider>
		);
	}

	return (
		<ToolbarDropdownMenuProvider isOpen={isPaletteOpen} setIsOpen={setIsPaletteOpen}>
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
				tooltipComponent={
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
					/>
				}
			>
				{children}
			</ToolbarDropdownMenu>
		</ToolbarDropdownMenuProvider>
	);
};
