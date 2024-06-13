/** @jsx jsx */
import React, { useRef, useState } from 'react';

import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import {
	getAriaKeyshortcuts,
	toggleHighlightPalette,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import { highlightMessages as messages } from '@atlaskit/editor-common/messages';
import { expandIconWrapperStyle } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ColorPalette,
	getSelectedRowAndColumnFromPalette,
	highlightColorPalette,
} from '@atlaskit/editor-common/ui-color';
import {
	ArrowKeyNavigationType,
	DropdownContainer as Dropdown,
	TOOLBAR_BUTTON,
	ToolbarButton,
} from '@atlaskit/editor-common/ui-menu';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { Flex } from '@atlaskit/primitives';

import { changeColor, setPalette } from '../commands';
import type { HighlightPlugin } from '../plugin';

import { EditorHighlightIcon } from './EditorHighlightIcon';

type ToolbarHighlightColorProps = {
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	disabled: boolean;
	isToolbarReducedSpacing: boolean;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	pluginInjectionApi: ExtractInjectionAPI<HighlightPlugin> | undefined;
	editorView: EditorView;
} & WrappedComponentProps;

const ToolbarHighlightColor = ({
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	isToolbarReducedSpacing,
	disabled,
	pluginInjectionApi,
	intl: { formatMessage },
	editorView,
}: ToolbarHighlightColorProps) => {
	const toolbarItemRef = useRef<ToolbarButtonRef>(null);
	const [isOpenedByKeyboard, setIsOpenedByKeyboard] = useState(false);

	const { highlightState } = useSharedPluginState(pluginInjectionApi, ['highlight']);

	const isDropdownOpen: boolean = !!highlightState?.isPaletteOpen;

	const setDropdownOpen = (isOpen: boolean) => {
		if (!highlightState?.disabled) {
			const { state, dispatch } = editorView;
			setPalette(pluginInjectionApi!, isOpen)(state, dispatch);
		}
	};

	const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

	const handleClick = () => {
		setIsOpenedByKeyboard(false);
		toggleDropdown();
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();

			setIsOpenedByKeyboard(true);
			toggleDropdown();
		}
	};

	const handleClickOutside = () => {
		if (isDropdownOpen) {
			setDropdownOpen(false);
			setIsOpenedByKeyboard(false);
		}
	};

	const handleEscapeKeydown = () => {
		if (isDropdownOpen) {
			setDropdownOpen(false);
			setIsOpenedByKeyboard(false);
			toolbarItemRef?.current?.focus();
		}
	};

	const handleColorChange = (color: string) => {
		pluginInjectionApi?.core?.actions.execute(
			changeColor(pluginInjectionApi?.analytics?.actions)({
				color,
			}),
		);
		setDropdownOpen(false);
	};

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

	// pixels, used to determine where to horizontally position the dropdown when space is limited
	// this should reflect the width of the dropdown when fully populated with colors, including translations due to layering
	const fitWidth = 242;

	const { selectedRowIndex, selectedColumnIndex } = getSelectedRowAndColumnFromPalette(
		highlightColorPalette,
		highlightState.activeColor,
	);

	return (
		<Flex alignItems="center">
			<Dropdown
				mountTo={popupsMountPoint}
				boundariesElement={popupsBoundariesElement}
				scrollableElement={popupsScrollableElement}
				isOpen={isDropdownOpen && !highlightState.disabled}
				handleClickOutside={handleClickOutside}
				handleEscapeKeydown={handleEscapeKeydown}
				zIndex={akEditorMenuZIndex}
				fitWidth={fitWidth}
				closeOnTab={true}
				arrowKeyNavigationProviderOptions={{
					type: ArrowKeyNavigationType.COLOR,
					selectedRowIndex,
					selectedColumnIndex,
					isOpenedByKeyboard,
					isPopupPositioned: true,
				}}
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
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
								<span css={expandIconWrapperStyle}>
									<ExpandIcon label="" />
								</span>
							</Flex>
						}
					/>
				}
			>
				<div data-testid="highlight-color-palette">
					<ColorPalette
						onClick={(color) => handleColorChange(color)}
						selectedColor={highlightState.activeColor}
						paletteOptions={{
							palette: highlightColorPalette,
							hexToPaletteColor: hexToEditorTextBackgroundPaletteColor,
						}}
					/>
				</div>
			</Dropdown>
		</Flex>
	);
};

export const ToolbarHighlightColorWithIntl = injectIntl(ToolbarHighlightColor);
