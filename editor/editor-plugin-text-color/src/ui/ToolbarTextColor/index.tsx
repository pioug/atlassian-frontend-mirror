/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type {
	AnalyticsEventPayload,
	DispatchAnalyticsEvent,
	EditorAnalyticsAPI,
	TextColorSelectedAEP,
	TextColorSelectedAttr,
	TextColorShowPaletteToggleAEP,
	TextColorShowPaletteToggleAttr,
} from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { SteppedRainbowIconDecoration } from '@atlaskit/editor-common/icons';
import { textColorMessages as messages } from '@atlaskit/editor-common/messages';
import {
	expandIconContainerStyle,
	expandIconWrapperStyle,
	separatorStyles,
	triggerWrapperStyles,
	wrapperStyle,
} from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ColorPalette,
	getSelectedRowAndColumnFromPalette,
	textPaletteTooltipMessages,
} from '@atlaskit/editor-common/ui-color';
import {
	ArrowKeyNavigationType,
	DropdownContainer as Dropdown,
	TOOLBAR_BUTTON,
	ToolbarButton,
} from '@atlaskit/editor-common/ui-menu';
import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';

import { changeColor as changeColorWithAnalytics } from '../../commands/change-color';
import type { TextColorPluginState } from '../../pm-plugins/main';
import type { TextColorPlugin } from '../../types';

import { EditorTextColorIcon } from './icon';

const EXPERIMENT_NAME: string = 'editor.toolbarTextColor.moreColors';
const EXPERIMENT_GROUP_CONTROL: string = 'control';

export interface State {
	isOpen: boolean;
	isOpenedByKeyboard: boolean;
}

export interface Props {
	pluginState: TextColorPluginState;
	editorView: EditorView;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	isReducedSpacing?: boolean;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	disabled?: boolean;
	pluginInjectionApi: ExtractInjectionAPI<TextColorPlugin> | undefined;
}

interface HandleOpenChangeData {
	isOpen: boolean;
	logCloseEvent: boolean;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class ToolbarTextColor extends React.Component<Props & WrappedComponentProps, State> {
	state: State = {
		isOpen: false,
		isOpenedByKeyboard: false,
	};
	private toolbarItemRef = React.createRef<HTMLElement>();

	changeColor = (color: string, editorAnalyticsApi: EditorAnalyticsAPI | undefined) =>
		changeColorWithAnalytics(color, editorAnalyticsApi)(
			this.props.editorView.state,
			this.props.editorView.dispatch,
		);

	render() {
		const { isOpen, isOpenedByKeyboard } = this.state;
		const {
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
			isReducedSpacing,
			pluginState,
			intl: { formatMessage },
			disabled,
			pluginInjectionApi,
		} = this.props;

		const palette = pluginState.palette;

		let fitWidth: number | undefined;
		if (document.body.clientWidth <= 740) {
			// This was originally hard-coded, but moved here to a const
			// My guess is it's based off (width of button * columns) + left/right padding
			// 240 = (32 * 7) + (8 + 8)
			// Not sure where the extra 2px comes from
			fitWidth = 242;
		}

		const selectedColor = this.getSelectedColor(pluginState);
		// TODO: This doesn't work, the label isn't translated
		const selectedColorPaletteItemLabel = palette.find(
			(paletteItem) => paletteItem.value === pluginState.color,
		)?.label;

		const selectedColorPaletteItemLabelText = selectedColorPaletteItemLabel || '';

		const labelTextColor = formatMessage(messages.textColor, {
			selectedColorName: selectedColorPaletteItemLabelText,
		});
		const tooltipTextColor = formatMessage(messages.textColorTooltip);

		const { selectedRowIndex, selectedColumnIndex } = getSelectedRowAndColumnFromPalette(
			palette,
			pluginState.color,
		);

		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<span css={wrapperStyle}>
				<Dropdown
					mountTo={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					scrollableElement={popupsScrollableElement}
					isOpen={isOpen && !pluginState.disabled}
					handleClickOutside={this.hide}
					handleEscapeKeydown={this.hideonEsc}
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
							buttonId={TOOLBAR_BUTTON.TEXT_COLOR}
							spacing={isReducedSpacing ? 'none' : 'default'}
							disabled={disabled || pluginState.disabled}
							selected={isOpen}
							aria-label={labelTextColor}
							aria-expanded={isOpen}
							aria-haspopup
							title={tooltipTextColor}
							onClick={this.toggleOpen}
							onKeyDown={this.onKeyDown}
							ref={this.toolbarItemRef}
							iconBefore={
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								<div css={triggerWrapperStyles}>
									<SteppedRainbowIconDecoration
										selectedColor={selectedColor}
										disabled={pluginState.disabled}
										icon={<EditorTextColorIcon />}
									/>
									{fg('platform_editor_migration_icon_and_typography') ? (
										//eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
										<span css={expandIconContainerStyle}>
											<ChevronDownIcon label="" color="currentColor" />
										</span>
									) : (
										//  eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
										<span css={expandIconWrapperStyle}>
											<ExpandIcon label="" />
										</span>
									)}
								</div>
							}
						/>
					}
				>
					<div data-testid="text-color-palette">
						<ColorPalette
							onClick={(color) =>
								this.changeTextColor(
									color,
									pluginInjectionApi?.analytics?.actions,
									pluginState.disabled,
								)
							}
							selectedColor={pluginState.color}
							paletteOptions={{
								palette,
								hexToPaletteColor: hexToEditorTextPaletteColor,
								paletteColorTooltipMessages: textPaletteTooltipMessages,
							}}
						/>
					</div>
				</Dropdown>
				{!pluginInjectionApi?.primaryToolbar && (
					/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage */
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					<span css={separatorStyles} />
				)}
			</span>
		);
	}

	private changeTextColor = (
		color: string,
		editorAnalyticsApi: EditorAnalyticsAPI | undefined,
		disabled?: boolean,
	) => {
		if (!disabled) {
			const {
				pluginState: { palette },
			} = this.props;

			// we store color names in analytics
			const swatch = palette.find((sw) => sw.value === color);

			this.dispatchAnalyticsEvent(
				this.buildAnalyticsSelectColor({
					color: (swatch ? swatch.label : color).toLowerCase(),
				}),
			);

			this.handleOpenChange({
				isOpen: false,
				logCloseEvent: false,
			});
			this.changeColor(color, editorAnalyticsApi);
			//To set the focus on the textcolor button when the menu is closed by 'Esc' only to meet aria guidelines
			this.props.editorView?.focus();
		}
		return false;
	};

	private toggleOpen = () => {
		this.handleOpenChange({ isOpen: !this.state.isOpen, logCloseEvent: true });
	};

	private onKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.setState({
				isOpenedByKeyboard: true,
			});
			this.toggleOpen();
		}
	};

	private handleOpenChange = ({ isOpen, logCloseEvent }: HandleOpenChangeData) => {
		this.setState({
			isOpen,
		});
		if (!isOpen) {
			this.setState({
				isOpenedByKeyboard: false,
			});
		}

		if (logCloseEvent) {
			this.dispatchAnalyticsEvent(
				this.buildAnalyticsPalette(isOpen ? ACTION.OPENED : ACTION.CLOSED, {
					noSelect: isOpen === false,
				}),
			);
		}
	};

	private hide = (e: MouseEvent | KeyboardEvent) => {
		const { isOpen } = this.state;

		if (isOpen === true) {
			this.dispatchAnalyticsEvent(
				this.buildAnalyticsPalette(ACTION.CLOSED, {
					noSelect: true,
				}),
			);

			this.setState({ isOpen: false });
			if (e instanceof KeyboardEvent && e.key === 'Escape') {
				this.toolbarItemRef?.current?.focus();
			}
		}
	};

	private hideonEsc = (e: MouseEvent | KeyboardEvent) => {
		this.hide(e);
		this.toolbarItemRef?.current?.focus();
	};

	private getSelectedColor(pluginState: TextColorPluginState) {
		const selectedColor =
			pluginState.color !== pluginState.defaultColor
				? pluginState.color
					? hexToEditorTextPaletteColor(pluginState.color)!
					: pluginState.color
				: null;
		return selectedColor;
	}

	private getCommonAnalyticsAttributes() {
		return {
			experiment: EXPERIMENT_NAME,
			experimentGroup: EXPERIMENT_GROUP_CONTROL,
		};
	}

	private buildAnalyticsPalette(
		action: ACTION.OPENED | ACTION.CLOSED,
		data: TextColorShowPaletteToggleAttr,
	): TextColorShowPaletteToggleAEP {
		return {
			action,
			actionSubject: ACTION_SUBJECT.TOOLBAR,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				...this.getCommonAnalyticsAttributes(),
				...data,
			},
		};
	}

	private buildAnalyticsSelectColor(data: TextColorSelectedAttr): TextColorSelectedAEP {
		return {
			action: ACTION.FORMATTED,
			actionSubject: ACTION_SUBJECT.TEXT,
			actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				...this.getCommonAnalyticsAttributes(),
				...data,
			},
		};
	}

	private dispatchAnalyticsEvent(payload: AnalyticsEventPayload) {
		const { dispatchAnalyticsEvent } = this.props;

		if (dispatchAnalyticsEvent) {
			dispatchAnalyticsEvent(payload);
		}
	}
}

export default injectIntl(ToolbarTextColor);
