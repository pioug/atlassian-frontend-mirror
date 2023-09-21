/** @jsx jsx */
import type { RefObject } from 'react';
import React from 'react';
import { css, jsx } from '@emotion/react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { Popup } from '@atlaskit/editor-common/ui';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import type { ColorType as Color } from '@atlaskit/status/picker';
import { StatusPicker as AkStatusPicker } from '@atlaskit/status/picker';
import { borderRadius } from '@atlaskit/theme/constants';
import { N0 } from '@atlaskit/theme/colors';

import withOuterListeners from '../../../ui/with-outer-listeners';
import { DEFAULT_STATUS } from '../actions';
import { analyticsState, createStatusAnalyticsAndFire } from '../analytics';
import type { StatusType, ClosingPayload } from '../plugin';
import { token } from '@atlaskit/tokens';

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
  defaultText?: string;
  defaultColor?: Color;
  defaultLocalId?: string;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  mountTo?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
}

export interface State {
  color: Color;
  text: string;
  localId?: string;
  isNew?: boolean;
}

const pickerContainer = css`
  background: ${token('elevation.surface.overlay', N0)};
  padding: ${token('space.100', '8px')} 0;
  border-radius: ${borderRadius()}px;
  box-shadow: ${token(
    'elevation.shadow.overlay',
    '0 0 1px rgba(9, 30, 66, 0.31), 0 4px 8px -2px rgba(9, 30, 66, 0.25)',
  )};
  :focus {
    outline: none;
  }
  input {
    text-transform: uppercase;
  }
`;

export class StatusPickerWithoutAnalytcs extends React.Component<Props, State> {
  private startTime!: number;
  private inputMethod?: InputMethod;
  private createStatusAnalyticsAndFireFunc: Function;
  private popupBodyWrapper: RefObject<HTMLDivElement>;

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
    if (typeof this.props.isNew === 'boolean' && this.props.isNew === false) {
      // Wrapper should be focused only if status already exists otherwise input field will receive focus
      this.popupBodyWrapper?.current?.focus();
    }
  }

  componentWillUnmount() {
    this.fireStatusPopupClosedAnalytics(this.state);
    this.startTime = 0;
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    _snapshot?: any,
  ): void {
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
    const inputField =
      event.currentTarget.querySelector<HTMLInputElement>('input');
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
  private handleArrow = (
    event: React.KeyboardEvent,
    closingMethod: closingMethods,
  ) => {
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
      return this.handleArrow(
        event,
        closingMethods[event.key as keyof typeof closingMethods],
      );
    }
  };

  render() {
    const { isNew, target, mountTo, boundariesElement, scrollableElement } =
      this.props;
    const { color, text } = this.state;
    return (
      target && (
        <PopupWithListeners
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
          <div
            css={pickerContainer}
            tabIndex={-1}
            ref={this.popupBodyWrapper}
            onClick={this.handlePopupClick}
            onKeyDown={this.onKeyDown}
          >
            <AkStatusPicker
              autoFocus={isNew}
              selectedColor={color}
              text={text}
              onColorClick={this.onColorClick}
              onColorHover={this.onColorHover}
              onTextChanged={this.onTextChanged}
              onEnter={this.onEnter}
            />
          </div>
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

export default withAnalyticsEvents()(StatusPickerWithoutAnalytcs);
