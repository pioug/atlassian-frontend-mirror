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
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { DynamicStrokeIconDecoration } from '@atlaskit/editor-common/icons';
import {
	getAriaKeyshortcuts,
	toggleHighlightPalette,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import { highlightMessages as messages } from '@atlaskit/editor-common/messages';
import {
	disableBlueBorderStyles,
	expandIconContainerStyle,
	triggerWrapperStylesWithPadding,
} from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import HighlightIcon from '@atlaskit/icon/core/highlight';
import { Flex } from '@atlaskit/primitives/compiled';

import { setPalette } from '../editor-commands/palette';
import type { HighlightPlugin } from '../highlightPluginType';

import { PaletteDropdown } from './shared/PaletteDropdown';
import { useDropdownEvents } from './shared/useDropdownEvents';

type PrimaryToolbarHighlightColorProps = {
	disabled: boolean;
	editorView: EditorView;
	isToolbarReducedSpacing: boolean;
	pluginInjectionApi: ExtractInjectionAPI<HighlightPlugin> | undefined;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
} & WrappedComponentProps;

const selector = (
	states: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<HighlightPlugin>, 'highlight'>,
) => {
	return {
		isPaletteOpen: states.highlightState?.isPaletteOpen,
		highlightDisabled: states.highlightState?.disabled,
		activeColor: states.highlightState?.activeColor,
	};
};

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
	const { isPaletteOpen, highlightDisabled, activeColor } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['highlight'],
		selector,
	);

	const setIsDropdownOpen = (isOpen: boolean) => {
		if (!highlightDisabled) {
			const { state, dispatch } = editorView;
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			setPalette(pluginInjectionApi!)({
				isPaletteOpen: isOpen,
				inputMethod: INPUT_METHOD.TOOLBAR,
			})(state, dispatch);
		}
	};

	const isDropdownOpen: boolean = !!isPaletteOpen;

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
	if (activeColor === undefined || highlightDisabled === undefined) {
		return null;
	}

	const toolbarButtonLabel = formatMessage(messages.highlight);

	// Get the design token for the  active color (if it exists) to modify the toolbar
	// icon, but show the nice rainbow if none is selected
	const activeColorToken =
		activeColor === null ? null : hexToEditorTextBackgroundPaletteColor(activeColor);

	return (
		<Flex alignItems="center">
			<PaletteDropdown
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				isOpen={isDropdownOpen && !highlightDisabled}
				activeColor={activeColor}
				trigger={
					<ToolbarButton
						// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-imported-style-values
						css={disableBlueBorderStyles}
						buttonId={TOOLBAR_BUTTON.BACKGROUND_COLOR}
						spacing={isToolbarReducedSpacing ? 'none' : 'default'}
						disabled={disabled || highlightDisabled}
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
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
							<div css={triggerWrapperStylesWithPadding}>
								<DynamicStrokeIconDecoration
									selectedColor={activeColorToken}
									disabled={highlightDisabled}
									icon={<HighlightIcon label="" color="currentColor" spacing="spacious" />}
								/>
								{
									//eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
									<span css={expandIconContainerStyle}>
										<ChevronDownIcon label="" color="currentColor" size="small" />
									</span>
								}
							</div>
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
