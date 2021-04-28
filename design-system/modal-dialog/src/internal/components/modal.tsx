import React from 'react';

import { canUseDOM } from 'exenv';
import { UIDConsumer, UIDReset } from 'react-uid';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import Blanket from '@atlaskit/blanket';

import { WIDTH_ENUM, WidthNames } from '../constants';
import { Dialog, FillScreen as StyledFillScreen } from '../styles/modal';
import type {
  KeyboardOrMouseEvent,
  ModalDialogProps,
  ScrollBehavior,
} from '../types';

import { Animation } from './animation';
import Content from './content';
import FocusLock from './focus-lock';
import Positioner from './positioner';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

function getScrollDistance() {
  return (
    window.pageYOffset ||
    (document.documentElement && document.documentElement.scrollTop) ||
    (document.body && document.body.scrollTop) ||
    0
  );
}

interface Props extends ModalDialogProps {
  /**
   * Controls the open state of the modal dialog.
   */
  isOpen: boolean;

  onClose: (e: KeyboardOrMouseEvent) => void;

  scrollBehavior: ScrollBehavior;
}

interface State {
  dialogNode: Node | null;
  scrollDistance: number;
}

class Modal extends React.Component<Props, State> {
  state = {
    dialogNode: null,
    scrollDistance: canUseDOM ? getScrollDistance() : 0,
    isExiting: false,
  };

  componentDidMount() {
    const scrollDistance = getScrollDistance();
    if (getScrollDistance() !== this.state.scrollDistance) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ scrollDistance });
    }
    window.addEventListener('scroll', this.handleWindowScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleWindowScroll);
  }

  /* Prevent window from being scrolled programatically so that the modal is positioned correctly
   * and to prevent scrollIntoView from scrolling the window.
   */
  handleWindowScroll = () => {
    if (getScrollDistance() !== this.state.scrollDistance) {
      window.scrollTo(window.pageXOffset, this.state.scrollDistance);
    }
  };

  handleOverlayClick = (e: KeyboardOrMouseEvent) => {
    if (this.props.shouldCloseOnOverlayClick) {
      this.props.onClose(e);
    }
  };

  render() {
    const {
      actions,
      appearance,
      autoFocus,
      body,
      children,
      components,
      footer,
      header,
      height,
      isBlanketHidden,
      isChromeless,
      isHeadingMultiline,
      isOpen,
      onClose,
      onCloseComplete,
      onOpenComplete,
      onStackChange,
      shouldCloseOnEscapePress,
      stackIndex,
      heading,
      width,
      scrollBehavior,
      testId,
    } = this.props;

    const { scrollDistance } = this.state;

    const isBackground = stackIndex != null && stackIndex > 0;

    // If a custom width (number or percentage) is supplied, set inline style
    // otherwise allow styled component to consume as named prop
    const widthName = width
      ? WIDTH_ENUM.values.indexOf(width.toString()) !== -1
        ? (width as WidthNames)
        : undefined
      : undefined;
    const widthValue = widthName ? undefined : width;

    return (
      <Animation
        in={isOpen}
        onExited={onCloseComplete}
        onEntered={onOpenComplete}
        stackIndex={stackIndex}
      >
        {({ fade, slide }) => (
          <StyledFillScreen
            style={fade}
            aria-hidden={isBackground}
            scrollDistance={scrollDistance}
          >
            <FocusLock
              isEnabled={stackIndex === 0 && isOpen}
              autoFocus={autoFocus}
            >
              <Blanket
                isTinted={!isBlanketHidden}
                onBlanketClicked={this.handleOverlayClick}
                testId={testId && `${testId}--blanket`}
              />
              <Positioner
                style={slide}
                scrollBehavior={scrollBehavior}
                widthName={widthName}
                widthValue={widthValue}
                data-testid={testId && `${testId}--positioner`}
              >
                {/*
                  When converting this into lite mode, please use `useUID` hooks instead. More can be find here: https://github.com/thearnica/react-uid
                 */}
                <UIDReset>
                  <UIDConsumer>
                    {(id, _) => (
                      <Dialog
                        heightValue={height}
                        isChromeless={isChromeless}
                        role="dialog"
                        aria-labelledby={`dialog-heading-${id}`}
                        data-testid={testId}
                        tabIndex={-1}
                      >
                        <Content
                          actions={actions}
                          appearance={appearance}
                          components={components}
                          footer={footer}
                          heading={heading}
                          headingId={`dialog-heading-${id}`}
                          testId={testId && `${testId}-dialog-content`}
                          isHeadingMultiline={isHeadingMultiline}
                          header={header}
                          onClose={onClose}
                          shouldScroll={
                            scrollBehavior === 'inside' ||
                            scrollBehavior === 'inside-wide'
                          }
                          shouldCloseOnEscapePress={shouldCloseOnEscapePress}
                          onStackChange={onStackChange}
                          isChromeless={isChromeless}
                          stackIndex={stackIndex}
                          body={body}
                        >
                          {children}
                        </Content>
                      </Dialog>
                    )}
                  </UIDConsumer>
                </UIDReset>
              </Positioner>
            </FocusLock>
          </StyledFillScreen>
        )}
      </Animation>
    );
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export const ModalDialogWithoutAnalytics = Modal;

export default withAnalyticsContext({
  componentName: 'modalDialog',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClose: createAndFireEventOnAtlaskit({
      action: 'closed',
      actionSubject: 'modalDialog',

      attributes: {
        componentName: 'modalDialog',
        packageName,
        packageVersion,
      },
    }),
  })(Modal),
);
