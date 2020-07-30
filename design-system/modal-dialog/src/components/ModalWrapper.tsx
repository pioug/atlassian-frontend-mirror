import React from 'react';

import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import { WidthNames } from '../shared-variables';
import {
  ActionProps,
  AppearanceType,
  KeyboardOrMouseEvent,
  ScrollBehavior,
} from '../types';

import { FooterComponentProps } from './Footer';
import { HeaderComponentProps } from './Header';
import Modal from './Modal';
import { ModalTransitionConsumer } from './ModalTransition';
import StackConsumer from './StackConsumer';

export interface WrapperProps extends WithAnalyticsEventsProps {
  /**
   * Buttons to render in the footer.
   * The first element in the array will implictly become the primary action.
   */
  actions?: Array<ActionProps>;

  /**
   * Appearance of the modal that changes the color of the primary action and adds an icon to the heading.
   */
  appearance?: AppearanceType;

  /**
   * Will focus on the first interactive element inside the modal dialog when `true`.
   * Pass in a callback function to return a HTML element to focus if you need more control.
   * Defaults to `true`.
   */
  autoFocus: boolean | (() => HTMLElement | null);

  /**
   * Contents of the modal dialog.
   */
  children?: React.ReactNode;

  /**
   * Component overrides to change components in the modal dialog.
   */
  components?: {
    Header?: React.ElementType<HeaderComponentProps>;
    Footer?: React.ElementType<FooterComponentProps>;
    Body?: React.ElementType;
    Container?: React.ElementType;
  };

  /**
   * Do not use. This prop has been deprecated.
   * Use the `components` prop instead.
   */
  body?: React.ElementType;

  /**
   * Do not use. This prop has been deprecated.
   * Use the `components` prop instead.
   */
  footer?: React.ElementType<FooterComponentProps>;

  /**
   * Do not use. This prop has been deprecated.
   * Use the `components` prop instead.
   */
  header?: React.ElementType<HeaderComponentProps>;

  /**
   * Heading for the modal dialog.
   */
  heading?: React.ReactNode;

  /**
   * When `true` will allow the heading to span multiple lines.
   * Defaults to `false`.
   */
  isHeadingMultiline?: boolean;

  /**
   * Height of the modal dialog.
   * When unset the modal dialog will grow to fill the viewport and then start overflowing its contents.
   */
  height?: number | string;

  /**
   * Width of the modal dialog.
   * The recommended way to specify modal width is using named size options.
   * Defaults to `medium`.
   */
  width?: number | string | WidthNames;

  /**
   * Callback function called when the modal dialog is requesting to be closed.
   */
  onClose: (event: KeyboardOrMouseEvent) => void;

  /**
   * Callback function called when the modal dialog has finished closing.
   */
  onCloseComplete?: (element: HTMLElement) => void;

  /**
   * Callback function called when the modal dialog has finished opening.
   */
  onOpenComplete?: (node: HTMLElement, isAppearing: boolean) => void;

  /**
   * Callback function called when the modal changes position in the stack.
   */
  onStackChange?: (stackIndex: number) => void;

  /**
   * Controls the positioning and scroll behaviour of the modal dialog.
    - `inside` scrolls overflow contents within the modal dialog body.
    - `outside` turns off overflow and will scroll the entire modal dialog.
    - `inside-wide` has the same behaviour as `inside` but is made for wide horizontal scrolling applications, like Trello.
  */
  scrollBehavior: ScrollBehavior;

  /**
   * Calls `onClose` when clicking the blanket behind the modal dialog.
   * Defaults to `true`.
   */
  shouldCloseOnOverlayClick?: boolean;

  /**
   * Calls `onClose` when pressing escape.
   * Defaults to `true`.
   */
  shouldCloseOnEscapePress?: boolean;

  /**
   * Will remove all styling from the modal dialog container allowing you to define your own styles,
   * heading,
   * and footer with actions.
   * This prop should only be used as a last resort.
   */
  isChromeless?: boolean;

  /**
   * Number representing where in the stack of modals this modal sits.
   * This offsets the modal dialogs vertical position.
   */
  stackIndex?: number;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

interface State {
  modalVisible: boolean;
}

class ModalWrapper extends React.Component<WrapperProps, State> {
  static defaultProps = {
    autoFocus: true,
    scrollBehavior: 'inside',
    shouldCloseOnEscapePress: true,
    shouldCloseOnOverlayClick: true,
    isChromeless: false,
    width: 'medium',
    isHeadingMultiline: true,
    onClose: () => {},
  };

  onModalClosed = (onExited?: () => any) => (e: HTMLElement) => {
    if (onExited) {
      onExited();
    }
    if (this.props.onCloseComplete) {
      this.props.onCloseComplete(e);
    }
  };

  render() {
    return (
      <ModalTransitionConsumer>
        {({ isOpen, onExited }) => (
          <Portal zIndex={layers.modal()}>
            <StackConsumer isOpen={isOpen}>
              {naturalStackIndex => (
                <Modal
                  {...this.props}
                  isOpen={isOpen}
                  stackIndex={this.props.stackIndex || naturalStackIndex}
                  onCloseComplete={this.onModalClosed(onExited)}
                >
                  {this.props.children}
                </Modal>
              )}
            </StackConsumer>
          </Portal>
        )}
      </ModalTransitionConsumer>
    );
  }
}

export default ModalWrapper;
