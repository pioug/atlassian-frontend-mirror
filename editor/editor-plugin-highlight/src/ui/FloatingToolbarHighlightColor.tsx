/** @jsx jsx */
import { useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { highlightMessages as messages } from '@atlaskit/editor-common/messages';
import { expandIconWrapperStyle } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { Flex } from '@atlaskit/primitives';

import type { HighlightPlugin } from '../plugin';

import { EditorHighlightIcon } from './shared/EditorHighlightIcon';
import { PaletteDropdown } from './shared/PaletteDropdown';
import { useDropdownEvents } from './shared/useDropdownEvents';

type FloatingToolbarHighlightColorProps = {
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	disabled: boolean;
	isToolbarReducedSpacing: boolean;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	pluginInjectionApi: ExtractInjectionAPI<HighlightPlugin> | undefined;
} & WrappedComponentProps;

const FloatingToolbarHighlightColor = ({
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	isToolbarReducedSpacing,
	disabled,
	pluginInjectionApi,
	intl: { formatMessage },
}: FloatingToolbarHighlightColorProps) => {
	const toolbarItemRef = useRef<ToolbarButtonRef>(null);
	const { highlightState } = useSharedPluginState(pluginInjectionApi, ['highlight']);

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const {
		handleClick,
		handleKeyDown,
		handleClickOutside,
		handleEscapeKeydown,
		handleColorChange,
		isOpenedByKeyboard,
	} = useDropdownEvents({
		toolbarItemRef,
		setIsDropdownOpen,
		isDropdownOpen,
		pluginInjectionApi,
	});

	// Don't render the toolbar option while the plugin is initialising
	if (!highlightState) {
		return null;
	}

	const toolbarButtonLabel = formatMessage(messages.highlight);

	// Get the design token for the  active color (if it exists) to modify the toolbar
	// icon, but show the nice rainbow if none is selected
	const activeColorToken =
		highlightState.activeColor === null
			? null
			: hexToEditorTextBackgroundPaletteColor(highlightState.activeColor);

	return (
		<Flex alignItems="center">
			<PaletteDropdown
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				isOpen={isDropdownOpen && !highlightState.disabled}
				activeColor={highlightState.activeColor}
				trigger={
					<ToolbarButton
						buttonId={TOOLBAR_BUTTON.BACKGROUND_COLOR}
						spacing={isToolbarReducedSpacing ? 'none' : 'default'}
						disabled={disabled || highlightState.disabled}
						selected={isDropdownOpen}
						aria-label={toolbarButtonLabel}
						aria-expanded={isDropdownOpen}
						aria-haspopup
						title={toolbarButtonLabel}
						onClick={handleClick}
						onKeyDown={handleKeyDown}
						ref={toolbarItemRef}
						iconBefore={
							<Flex>
								<EditorHighlightIcon
									selectedColor={activeColorToken}
									disabled={highlightState.disabled}
								/>
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={expandIconWrapperStyle}>
									<ExpandIcon label="" />
								</span>
							</Flex>
						}
					/>
				}
				onColorChange={(color) => handleColorChange(color)}
				isOpenedByKeyboard={isOpenedByKeyboard}
				handleClickOutside={handleClickOutside}
				handleEscapeKeydown={handleEscapeKeydown}
			/>
		</Flex>
	);
};

export const FloatingToolbarHighlightColorWithIntl = injectIntl(FloatingToolbarHighlightColor);
