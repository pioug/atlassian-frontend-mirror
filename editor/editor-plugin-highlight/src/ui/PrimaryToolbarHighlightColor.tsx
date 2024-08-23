/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import {
	getAriaKeyshortcuts,
	toggleHighlightPalette,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import { highlightMessages as messages } from '@atlaskit/editor-common/messages';
import { expandIconContainerStyle } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import { Flex } from '@atlaskit/primitives';

import { setPalette } from '../commands';
import type { HighlightPlugin } from '../plugin';

import { EditorHighlightIcon } from './shared/EditorHighlightIcon';
import { PaletteDropdown } from './shared/PaletteDropdown';
import { useDropdownEvents } from './shared/useDropdownEvents';

type PrimaryToolbarHighlightColorProps = {
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	disabled: boolean;
	isToolbarReducedSpacing: boolean;
	pluginInjectionApi: ExtractInjectionAPI<HighlightPlugin> | undefined;
	editorView: EditorView;
} & WrappedComponentProps;

const PrimaryToolbarHighlightColor = ({
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	isToolbarReducedSpacing,
	disabled,
	pluginInjectionApi,
	intl: { formatMessage },
	editorView,
}: PrimaryToolbarHighlightColorProps) => {
	const toolbarItemRef = useRef<ToolbarButtonRef>(null);
	const { highlightState } = useSharedPluginState(pluginInjectionApi, ['highlight']);

	const setIsDropdownOpen = (isOpen: boolean) => {
		if (!highlightState?.disabled) {
			const { state, dispatch } = editorView;
			setPalette(pluginInjectionApi!)({
				isPaletteOpen: isOpen,
				inputMethod: INPUT_METHOD.TOOLBAR,
			})(state, dispatch);
		}
	};

	const isDropdownOpen: boolean = !!highlightState?.isPaletteOpen;

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
						aria-label={tooltip(toggleHighlightPalette, toolbarButtonLabel)}
						aria-keyshortcuts={getAriaKeyshortcuts(toggleHighlightPalette)}
						aria-expanded={isDropdownOpen}
						aria-haspopup
						title={tooltip(toggleHighlightPalette, toolbarButtonLabel)}
						onClick={handleClick}
						onKeyDown={handleKeyDown}
						ref={toolbarItemRef}
						iconBefore={
							<Flex>
								<EditorHighlightIcon
									selectedColor={activeColorToken}
									disabled={highlightState.disabled}
								/>

								<span
									// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									css={expandIconContainerStyle}
								>
									<ChevronDownIcon label="" color="currentColor" LEGACY_margin="0 0 0 -8px" />
								</span>
							</Flex>
						}
					/>
				}
				onColorChange={(color) => handleColorChange({ color, inputMethod: INPUT_METHOD.TOOLBAR })}
				isOpenedByKeyboard={isOpenedByKeyboard}
				handleClickOutside={handleClickOutside}
				handleEscapeKeydown={handleEscapeKeydown}
			/>
		</Flex>
	);
};

export const PrimaryToolbarHighlightColorWithIntl = injectIntl(PrimaryToolbarHighlightColor);
