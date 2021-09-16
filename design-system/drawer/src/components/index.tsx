import React, {
  Children,
  Component,
  FC,
  Fragment,
  SyntheticEvent,
} from 'react';

import { canUseDOM } from 'exenv';
import { Transition, TransitionGroup } from 'react-transition-group';

import {
  createAndFireEvent,
  CreateUIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import Blanket from '@atlaskit/blanket';
import Portal from '@atlaskit/portal';

import { transitionDurationMs } from '../constants';

import FocusLock from './focus-lock';
import DrawerPrimitive from './primitives';
import { Fade } from './transitions';
import { CloseTrigger, DrawerProps, DrawerWidth } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const OnlyChild: FC<any> = ({ children }) =>
  Children.toArray(children)[0] || null;

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

const createAndFireOnClick = (
  createAnalyticsEvent: CreateUIAnalyticsEvent,
  trigger: CloseTrigger,
) =>
  createAndFireEventOnAtlaskit({
    action: 'dismissed',
    actionSubject: 'drawer',
    attributes: {
      componentName: 'drawer',
      packageName,
      packageVersion,
      trigger,
    },
  })(createAnalyticsEvent);

export class DrawerBase extends Component<
  DrawerProps,
  { renderPortal: boolean }
> {
  static defaultProps = {
    width: 'narrow' as DrawerWidth,
    isFocusLockEnabled: true,
    shouldReturnFocus: true,
    autoFocusFirstElem: false,
  };

  state = {
    renderPortal: false,
  };

  body = canUseDOM ? document.querySelector('body') : undefined;

  componentDidMount() {
    const { isOpen } = this.props;

    if (isOpen) {
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps: DrawerProps) {
    const { isOpen } = this.props;
    if (isOpen !== prevProps.isOpen) {
      if (isOpen) {
        window.addEventListener('keydown', this.handleKeyDown);
      } else {
        window.removeEventListener('keydown', this.handleKeyDown);
      }
    }
  }

  private handleBlanketClick = (event: SyntheticEvent<HTMLElement>) => {
    this.handleClose(event, 'blanket');
  };

  private handleBackButtonClick = (event: SyntheticEvent<HTMLElement>) => {
    this.handleClose(event, 'backButton');
  };

  private handleClose = (event: SyntheticEvent<any>, trigger: CloseTrigger) => {
    const { createAnalyticsEvent, onClose } = this.props;

    const analyticsEvent =
      createAnalyticsEvent &&
      createAndFireOnClick(createAnalyticsEvent, trigger);

    if (onClose) {
      onClose(event, analyticsEvent);
    }
  };

  handleKeyDown = (event: KeyboardEvent) => {
    const { isOpen, onKeyDown } = this.props;

    if (event.key === 'Escape' && isOpen) {
      this.handleClose((event as unknown) as React.KeyboardEvent, 'escKey');
    }
    if (onKeyDown) {
      onKeyDown((event as unknown) as React.KeyboardEvent);
    }
  };

  render() {
    if (!this.body) {
      return null;
    }
    const {
      testId,
      isOpen,
      children,
      icon,
      width,
      shouldUnmountOnExit,
      onCloseComplete,
      onOpenComplete,
      autoFocusFirstElem,
      isFocusLockEnabled,
      shouldReturnFocus,
      overrides,
    } = this.props;

    return (
      <Transition
        in={isOpen}
        timeout={{ enter: 0, exit: transitionDurationMs }}
        mountOnEnter
        unmountOnExit
      >
        <Portal zIndex="unset">
          <TransitionGroup component={OnlyChild}>
            <Fragment>
              <Fade in={isOpen}>
                <Blanket isTinted onBlanketClicked={this.handleBlanketClick} />
              </Fade>
              <FocusLock
                autoFocusFirstElem={autoFocusFirstElem}
                isFocusLockEnabled={isFocusLockEnabled}
                shouldReturnFocus={shouldReturnFocus}
              >
                <DrawerPrimitive
                  testId={testId}
                  icon={icon}
                  in={isOpen}
                  onClose={this.handleBackButtonClick}
                  onCloseComplete={onCloseComplete}
                  onOpenComplete={onOpenComplete}
                  width={width}
                  shouldUnmountOnExit={shouldUnmountOnExit}
                  overrides={overrides}
                >
                  {children}
                </DrawerPrimitive>
              </FocusLock>
            </Fragment>
          </TransitionGroup>
        </Portal>
      </Transition>
    );
  }
}

export default withAnalyticsContext({
  componentName: 'drawer',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(DrawerBase));
