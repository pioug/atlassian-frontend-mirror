/** @jsx jsx */
import { useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	type DispatchAnalyticsEvent,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { highlightMessages as messages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { token } from '@atlaskit/tokens';

import type { HighlightPlugin } from '../plugin';

import { EditorHighlightIcon } from './shared/EditorHighlightIcon';
import { PaletteDropdown } from './shared/PaletteDropdown';
import { useDropdownEvents } from './shared/useDropdownEvents';

const expandIconContainerStyle = css({
	margin: `0px ${token('space.negative.050', '-4px')}`,
});

const highlightIconContainerStyle = css({
	marginTop: token('space.negative.050', '-4px'),
});

type FloatingToolbarHighlightColorProps = {
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	pluginInjectionApi: ExtractInjectionAPI<HighlightPlugin> | undefined;
} & WrappedComponentProps;

const FloatingToolbarHighlightColor = ({
	pluginInjectionApi,
	intl: { formatMessage },
}: FloatingToolbarHighlightColorProps) => {
	const toolbarItemRef = useRef<ToolbarButtonRef>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { highlightState } = useSharedPluginState(pluginInjectionApi, ['highlight']);

	const setDropdownOpen = (isOpen: boolean) => {
		setIsDropdownOpen(isOpen);
		pluginInjectionApi?.analytics?.actions.fireAnalyticsEvent({
			action: isOpen ? ACTION.OPENED : ACTION.CLOSED,
			actionSubject: ACTION_SUBJECT.TOOLBAR,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BACKGROUND_COLOR,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				inputMethod: INPUT_METHOD.FLOATING_TB,
			},
		});
	};

	const {
		handleClick,
		handleKeyDown,
		handleClickOutside,
		handleEscapeKeydown,
		handleColorChange,
		isOpenedByKeyboard,
	} = useDropdownEvents({
		toolbarItemRef,
		setIsDropdownOpen: setDropdownOpen,
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
		<PaletteDropdown
			isOpen={isDropdownOpen && !highlightState.disabled}
			activeColor={highlightState.activeColor}
			trigger={
				<ToolbarButton
					buttonId={TOOLBAR_BUTTON.BACKGROUND_COLOR}
					spacing={'compact'}
					disabled={highlightState.disabled}
					selected={isDropdownOpen}
					aria-label={toolbarButtonLabel}
					aria-expanded={isDropdownOpen}
					aria-haspopup
					title={toolbarButtonLabel}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					ref={toolbarItemRef}
					iconBefore={
						<span css={highlightIconContainerStyle}>
							<EditorHighlightIcon
								selectedColor={activeColorToken}
								disabled={highlightState.disabled}
							/>
						</span>
					}
					iconAfter={
						<span css={expandIconContainerStyle}>
							<ExpandIcon label="" />
						</span>
					}
				>
					{formatMessage(messages.highlightFloatingToolbar)}
				</ToolbarButton>
			}
			onColorChange={(color) => handleColorChange({ color, inputMethod: INPUT_METHOD.FLOATING_TB })}
			isOpenedByKeyboard={isOpenedByKeyboard}
			handleClickOutside={handleClickOutside}
			handleEscapeKeydown={handleEscapeKeydown}
		/>
	);
};

export const FloatingToolbarHighlightColorWithIntl = injectIntl(FloatingToolbarHighlightColor);
