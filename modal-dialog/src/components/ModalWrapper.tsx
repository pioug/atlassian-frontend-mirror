import React from 'react';
import { layers } from '@atlaskit/theme/constants';
import Portal from '@atlaskit/portal';
import { ModalTransitionConsumer } from './ModalTransition';
import StackConsumer from './StackConsumer';

import { AppearanceType, KeyboardOrMouseEvent, ActionProps } from '../types';

import Modal from './Modal';
import { WidthNames } from '../shared-variables';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { FooterComponentProps } from './Footer';
import { HeaderComponentProps } from './Header';

export interface WrapperProps extends WithAnalyticsEventsProps {
  /**
    Buttons to render in the footer
  */
  actions?: Array<ActionProps>;
  /**
    Appearance of the primary action. Also adds an icon to the heading, if provided.
  */
  appearance?: AppearanceType;
  /**
    Boolean indicating whether to focus on the first tabbable element inside the focus lock.
  */
  autoFocus: boolean | (() => HTMLElement | null);
  /**
    Content of the modal
  */
  children?: React.ReactNode;
  /**
    Object containing header, footer, body and container components. Components here will be used instead of the defaults.
    - Header: container for the title
    - Footer: container for the actions
    - Body: container for the content. Component ref must return a HTMLElement. See Custom example.
    - Container: wrapper around Header, Body and Footer components.
  */
  components?: {
    Header?: React.ElementType<HeaderComponentProps>;
    Footer?: React.ElementType<FooterComponentProps>;
    Body?: React.ElementType;
    Container?: React.ElementType;
  };
  /**
    Deprecated, use components prop: Component to render the body of the modal, replaces the internal implementation.
  */
  body?: React.ElementType;
  /**
    Deprecated, use components prop: Component to render the footer of the modal, replaces internal implementation.
  */
  footer?: React.ElementType<FooterComponentProps>;
  /**
    Deprecated, use components prop: Component to render the header of the modal, replaces internal implementation.
  */
  header?: React.ElementType<HeaderComponentProps>;
  /**
    The modal title; rendered in the header.
  */
  heading?: React.ReactNode;
  /**
   * Makes heading multiline.
   * If false and heading is longer than one line overflow will be not displayed.
   */
  isHeadingMultiline?: boolean;
  /**
    Height of the modal. If not set, the modal grows to fit the content until it
    runs out of vertical space, at which point scrollbars appear. If a number is
    provided, the height is set to that number in pixels. A string including pixels,
    or a percentage, will be directly applied as a style. Several size options are
    also recognised.
  */
  height?: number | string;
  /**
    Function that will be called to initiate the exit transition.
  */
  onClose: (event: KeyboardOrMouseEvent) => void;
  /**
    Function that will be called when the exit transition is complete.
  */
  onCloseComplete?: (element: HTMLElement) => void;
  /**
    Function that will be called when the enter transition is complete.
  */
  onOpenComplete?: (node: HTMLElement, isAppearing: boolean) => void;
  /**
    Function that will be called when the modal changes position in the stack.
  */
  onStackChange?: (stackIndex: number) => void;
  /**
    Where scroll behaviour should originate. When `inside` scroll only occurs
    on the modal body. When `outside` the entire modal will scroll within the viewport.
  */
  scrollBehavior?: 'inside' | 'outside';
  /**
    Boolean indicating if clicking the overlay should close the modal.
  */
  shouldCloseOnOverlayClick?: boolean;
  /**
    Boolean indicating if pressing the `esc` key should close the modal.
  */
  shouldCloseOnEscapePress?: boolean;
  /**
    Boolean indicating content should be rendered on a transparent background.
  */
  isChromeless?: boolean;
  /**
    Number representing where this instance lives in the stack of modals.
  */
  stackIndex?: number;
  /**
    Width of the modal. This can be provided in three different ways.
    If a number is provided, the width is set to that number in pixels.
    A string including pixels, or a percentage, will be directly applied as a style.
    Several size options are also recognised.
  */
  width?: number | string | WidthNames;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
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
