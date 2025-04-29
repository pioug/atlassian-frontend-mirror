/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { MutableRefObject } from 'react';
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { statusMessages as messages } from '@atlaskit/editor-common/messages';
import { Popup } from '@atlaskit/editor-common/ui';
import {
	OutsideClickTargetRefContext,
	withReactEditorViewOuterListeners as withOuterListeners,
} from '@atlaskit/editor-common/ui-react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import type { ColorType as Color } from '@atlaskit/status/picker';
import { StatusPicker as AkStatusPicker } from '@atlaskit/status/picker';
import { N0 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { DEFAULT_STATUS } from '../pm-plugins/actions';
import type { ClosingPayload, StatusType } from '../types';

import { analyticsState, createStatusAnalyticsAndFire } from './analytics';

const PopupWithListeners = withOuterListeners(Popup);

export enum InputMethod {
	blur = 'blur',
	escKey = 'escKey',
	enterKey = 'enterKey',
}

export enum closingMethods {
	ArrowLeft = 'arrowLeft',
	ArrowRight = 'arrowRight',
}

export interface Props {
	target: HTMLElement | null;
	closeStatusPicker: (closingPayload?: ClosingPayload) => void;
	onSelect: (status: StatusType) => void;
	onTextChanged: (status: StatusType, isNew: boolean) => void;
	onEnter: (status: StatusType) => void;
	isNew?: boolean;
	focusStatusInput?: boolean;
	defaultText?: string;
	defaultColor?: Color;
	defaultLocalId?: string;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	mountTo?: HTMLElement;
	boundariesElement?: HTMLElement;
	scrollableElement?: HTMLElement;
	editorView: EditorView;
	intl: WrappedComponentProps['intl'];
}

export interface State {
	color: Color;
	text: string;
	localId?: string;
	isNew?: boolean;
}

const pickerContainerStyles = css({
	background: token('elevation.surface.overlay', N0),
	padding: `${token('space.100', '8px')} 0`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `${borderRadius()}px`,
	boxShadow: token(
		'elevation.shadow.overlay',
		'0 0 1px rgba(9, 30, 66, 0.31), 0 4px 8px -2px rgba(9, 30, 66, 0.25)',
	),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus': {
		outline: 'none',
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	input: {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		textTransform: 'uppercase',
	},
});

// eslint-disable-next-line @repo/internal/react/no-class-components
class StatusPickerWithIntl extends React.Component<Props, State> {
	private startTime!: number;
	private inputMethod?: InputMethod;
	private createStatusAnalyticsAndFireFunc: Function;
	private popupBodyWrapper: MutableRefObject<HTMLDivElement | null>;
	private focusTimeout: ReturnType<typeof requestAnimationFrame> | undefined;
	constructor(props: Props) {
		super(props);

		this.state = this.extractStateFromProps(props);

		this.createStatusAnalyticsAndFireFunc = createStatusAnalyticsAndFire(
			props.createAnalyticsEvent,
		);
		this.popupBodyWrapper = React.createRef();
	}

	private fireStatusPopupOpenedAnalytics(state: State) {
		const { color, text, localId, isNew } = state;
		this.startTime = Date.now();

		this.createStatusAnalyticsAndFireFunc({
			action: 'opened',
			actionSubject: 'statusPopup',
			attributes: {
				textLength: text ? text.length : 0,
				selectedColor: color,
				localId,
				state: analyticsState(isNew),
			},
		});
	}

	private fireStatusPopupClosedAnalytics(state: State) {
		const { color, text, localId, isNew } = state;
		this.createStatusAnalyticsAndFireFunc({
			action: 'closed',
			actionSubject: 'statusPopup',
			attributes: {
				inputMethod: this.inputMethod,
				duration: Date.now() - this.startTime,
				textLength: text ? text.length : 0,
				selectedColor: color,
				localId,
				state: analyticsState(isNew),
			},
		});
	}

	private reset() {
		this.startTime = Date.now();
		this.inputMethod = InputMethod.blur;
	}

	componentDidMount() {
		this.reset();
		this.fireStatusPopupOpenedAnalytics(this.state);
	}

	componentWillUnmount() {
		this.focusTimeout && cancelAnimationFrame(this.focusTimeout);
		this.fireStatusPopupClosedAnalytics(this.state);
		this.startTime = 0;
	}

	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
		const element = this.props.target;

		if (prevProps.target !== element) {
			const newState = this.extractStateFromProps(this.props);
			this.setState(newState);

			this.fireStatusPopupClosedAnalytics(prevState);
			this.reset();
			this.fireStatusPopupOpenedAnalytics(newState);
		}
	}

	private extractStateFromProps(props: Props): State {
		const { defaultColor, defaultText, defaultLocalId, isNew } = props;
		return {
			color: defaultColor || DEFAULT_STATUS.color,
			text: defaultText || DEFAULT_STATUS.text,
			localId: defaultLocalId,
			isNew,
		} as State;
	}

	handleClickOutside = (event: Event) => {
		event.preventDefault();
		this.inputMethod = InputMethod.blur;
		const selectedText = window.getSelection();
		if (!selectedText) {
			this.props.closeStatusPicker();
		}
	};

	private handleEscapeKeydown = (event: Event) => {
		event.preventDefault();
		this.inputMethod = InputMethod.escKey;
		this.props.onEnter(this.state);
	};

	private handleTabPress = (event: React.KeyboardEvent) => {
		const colorButtons = event.currentTarget.querySelectorAll('button');
		const inputField = event.currentTarget.querySelector<HTMLInputElement>('input');
		const isInputFocussed = document.activeElement === inputField;
		const isButtonFocussed = Array.from(colorButtons).some((buttonElement) => {
			return document?.activeElement === buttonElement;
		});
		if (event?.shiftKey) {
			/* shift + tab */
			if (isInputFocussed) {
				colorButtons[0].focus();
				event.preventDefault();
			}
			/* After the user presses shift + tab the color-palette component updates tab index for the first color to be 0.
          To correctly set focus to the input field instead of the first color button we need to set focus manually
          */
			if (isButtonFocussed) {
				inputField?.focus();
				event.preventDefault();
			}
		} else {
			/* tab */
			if (isButtonFocussed) {
				inputField?.focus();
				event.preventDefault();
			}
		}
	};
	private handleArrow = (event: React.KeyboardEvent, closingMethod: closingMethods) => {
		if (document?.activeElement === this.popupBodyWrapper.current) {
			event.preventDefault();
			this.popupBodyWrapper?.current?.blur();
			this.props.closeStatusPicker({ closingMethod });
		}
	};
	private onKeyDown = (event: React.KeyboardEvent) => {
		const isTabPressed = event.key === 'Tab';
		if (isTabPressed) {
			return this.handleTabPress(event);
		}
		if (event.key in closingMethods) {
			return this.handleArrow(event, closingMethods[event.key as keyof typeof closingMethods]);
		}
	};
	private setRef(setOutsideClickTargetRef: (el: HTMLElement | null) => void) {
		return (ref: HTMLDivElement) => {
			setOutsideClickTargetRef(ref);
			this.popupBodyWrapper.current = ref;
		};
	}

	private renderWithSetOutsideClickTargetRef(
		setOutsideClickTargetRef: (el: HTMLElement | null) => void,
	) {
		const { isNew, focusStatusInput } = this.props;
		const { color, text } = this.state;
		return (
			// eslint-disable-next-line jsx-a11y/no-static-element-interactions
			<div
				css={pickerContainerStyles}
				tabIndex={-1}
				ref={this.setRef(setOutsideClickTargetRef)}
				onClick={this.handlePopupClick}
				onKeyDown={this.onKeyDown}
			>
				<AkStatusPicker
					autoFocus={isNew || focusStatusInput}
					selectedColor={color}
					text={text}
					onColorClick={this.onColorClick}
					onColorHover={this.onColorHover}
					onTextChanged={this.onTextChanged}
					onEnter={this.onEnter}
				/>
			</div>
		);
	}

	render() {
		const { target, mountTo, boundariesElement, scrollableElement, editorView, intl } = this.props;

		if (!editorView?.editable) {
			return null;
		}

		return (
			target && (
				<PopupWithListeners
					ariaLabel={
						fg('editor_a11y_aria_label_removal_popup')
							? intl.formatMessage(messages.statusEditorLabel)
							: undefined
					}
					target={target}
					offset={[0, 8]}
					handleClickOutside={this.handleClickOutside}
					handleEscapeKeydown={this.handleEscapeKeydown}
					zIndex={akEditorFloatingDialogZIndex}
					fitHeight={40}
					mountTo={mountTo}
					boundariesElement={boundariesElement}
					scrollableElement={scrollableElement}
					closeOnTab={false}
				>
					{fg('editor_a11y_announce_status_editor_open') && (
						<VisuallyHidden aria-atomic role="alert">
							{intl.formatMessage(messages.statusPickerOpenedAlert)}
						</VisuallyHidden>
					)}
					<OutsideClickTargetRefContext.Consumer>
						{this.renderWithSetOutsideClickTargetRef.bind(this)}
					</OutsideClickTargetRefContext.Consumer>
				</PopupWithListeners>
			)
		);
	}

	private onColorHover = (color: Color) => {
		this.createStatusAnalyticsAndFireFunc({
			action: 'hovered',
			actionSubject: 'statusColorPicker',
			attributes: {
				color,
				localId: this.state.localId,
				state: analyticsState(this.props.isNew),
			},
		});
	};

	private onColorClick = (color: Color) => {
		const { text, localId } = this.state;

		if (color === this.state.color) {
			this.createStatusAnalyticsAndFireFunc({
				action: 'clicked',
				actionSubject: 'statusColorPicker',
				attributes: {
					color,
					localId,
					state: analyticsState(this.props.isNew),
				},
			});
			// closes status box and commits colour
			this.onEnter();
		} else {
			this.setState({ color });
			this.props.onSelect({
				text,
				color,
				localId,
			});
		}
	};

	private onTextChanged = (text: string) => {
		const { color, localId } = this.state;
		this.setState({ text });
		this.props.onTextChanged(
			{
				text,
				color,
				localId,
			},
			!!this.props.isNew,
		);
	};

	private onEnter = () => {
		this.inputMethod = InputMethod.enterKey;
		this.props.onEnter(this.state);
	};

	// cancel bubbling to fix clickOutside logic:
	// popup re-renders its content before the click event bubbles up to the document
	// therefore click target element would be different from the popup content
	private handlePopupClick = (event: React.MouseEvent<HTMLElement>) =>
		event.nativeEvent.stopImmediatePropagation();
}

export const StatusPickerWithoutAnalytcs = injectIntl(StatusPickerWithIntl);

export default withAnalyticsEvents()(StatusPickerWithoutAnalytcs);
