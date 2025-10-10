/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
	type DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { DynamicStrokeIconDecoration } from '@atlaskit/editor-common/icons';
import {
	toggleHighlightPalette,
	tooltip,
	getAriaKeyshortcuts,
} from '@atlaskit/editor-common/keymaps';
import { highlightMessages as messages } from '@atlaskit/editor-common/messages';
import {
	disableBlueBorderStyles,
	expandIconContainerStyle,
	triggerWrapperStylesWithPadding,
} from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ToolbarButtonRef } from '@atlaskit/editor-common/ui-menu';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { hexToEditorTextBackgroundPaletteColor } from '@atlaskit/editor-palette';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import HighlightIcon from '@atlaskit/icon/core/highlight';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { setPalette } from '../editor-commands/palette';
import type { HighlightPlugin } from '../highlightPluginType';

import { EditorHighlightIcon } from './shared/EditorHighlightIcon';
import { PaletteDropdown } from './shared/PaletteDropdown';
import { useDropdownEvents } from './shared/useDropdownEvents';

const expandIconContainerHighlightStyle = css({
	margin: `0px ${token('space.negative.050', '-4px')}`,
});

const highlightIconContainerStyle = css({
	marginTop: token('space.negative.050', '-4px'),
});

type FloatingToolbarHighlightColorProps = {
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorView: EditorView | undefined;
	pluginInjectionApi: ExtractInjectionAPI<HighlightPlugin> | undefined;
} & WrappedComponentProps;

const selector = (
	states: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<HighlightPlugin>, 'highlight'>,
) => {
	return {
		isPaletteOpen: states.highlightState?.isPaletteOpen,
		activeColor: states.highlightState?.activeColor,
		disabled: states.highlightState?.disabled,
	};
};

const FloatingToolbarHighlightColor = ({
	pluginInjectionApi,
	intl: { formatMessage },
	editorView,
}: FloatingToolbarHighlightColorProps) => {
	const toolbarItemRef = useRef<ToolbarButtonRef>(null);
	const { activeColor, disabled, isPaletteOpen } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['highlight'],
		selector,
	);

	const setDropdownOpen = (isOpen: boolean) => {
		if (!disabled && editorView && pluginInjectionApi) {
			const { state, dispatch } = editorView;
			setPalette(pluginInjectionApi)({
				isPaletteOpen: isOpen,
				inputMethod: INPUT_METHOD.FLOATING_TB,
			})(state, dispatch);
		}

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

	const isDropdownOpen = !!isPaletteOpen;

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
	if (activeColor === undefined || disabled === undefined) {
		return null;
	}

	const toolbarButtonLabel = formatMessage(messages.highlight);

	// Get the design token for the  active color (if it exists) to modify the toolbar
	// icon, but show the nice rainbow if none is selected
	const activeColorToken =
		activeColor === null ? null : hexToEditorTextBackgroundPaletteColor(activeColor);

	const title = editorExperiment('platform_editor_controls', 'variant1')
		? tooltip(toggleHighlightPalette, toolbarButtonLabel)
		: toolbarButtonLabel;

	return (
		<PaletteDropdown
			isOpen={isDropdownOpen && !disabled}
			activeColor={activeColor}
			trigger={
				<ToolbarButton
					// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-imported-style-values
					css={disableBlueBorderStyles}
					buttonId={TOOLBAR_BUTTON.BACKGROUND_COLOR}
					spacing={editorExperiment('platform_editor_controls', 'variant1') ? 'default' : 'compact'}
					disabled={disabled}
					selected={isDropdownOpen}
					aria-label={title}
					aria-keyshortcuts={getAriaKeyshortcuts(toggleHighlightPalette)}
					aria-expanded={isDropdownOpen}
					aria-haspopup
					title={title}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					ref={toolbarItemRef}
					iconBefore={
						fg('platform-visual-refresh-icons') ? (
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
							<div css={triggerWrapperStylesWithPadding}>
								<DynamicStrokeIconDecoration
									selectedColor={activeColorToken}
									disabled={disabled}
									icon={<HighlightIcon label="" color="currentColor" spacing="spacious" />}
								/>
								{
									// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
									<span css={expandIconContainerStyle}>
										<ChevronDownIcon label="" color="currentColor" size="small" />
									</span>
								}
							</div>
						) : (
							<span css={highlightIconContainerStyle}>
								<EditorHighlightIcon selectedColor={activeColorToken} disabled={disabled} />
							</span>
						)
					}
					iconAfter={
						fg('platform-visual-refresh-icons') ? undefined : (
							<span css={expandIconContainerHighlightStyle}>
								<ChevronDownIcon label="" color="currentColor" size="small" />
							</span>
						)
					}
				>
					{editorExperiment('platform_editor_controls', 'control') &&
						formatMessage(messages.highlightFloatingToolbar)}
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
