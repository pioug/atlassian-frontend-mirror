/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
import React, { Component, SyntheticEvent } from 'react';

import { canUseDOM } from 'exenv';

import {
  createAndFireEvent,
  CreateUIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import Portal from '@atlaskit/portal';

import { defaultFocusLockSettings } from '../constants';

import Blanket from './blanket';
import DrawerPrimitive from './primitives';
import { CloseTrigger, DrawerProps, DrawerWidth } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

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
    ...defaultFocusLockSettings,
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
      this.handleClose(event as unknown as React.KeyboardEvent, 'escKey');
    }
    if (onKeyDown) {
      onKeyDown(event as unknown as React.KeyboardEvent);
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
      zIndex = 'unset',
      label,
      titleId,
    } = this.props;

    return (
      <Portal zIndex={zIndex}>
        <Blanket
          isOpen={isOpen}
          onBlanketClicked={this.handleBlanketClick}
          testId={testId && `${testId}--blanket`}
        />
        <DrawerPrimitive
          testId={testId}
          icon={icon}
          in={isOpen}
          onClose={this.handleBackButtonClick}
          onCloseComplete={onCloseComplete}
          onOpenComplete={onOpenComplete}
          width={width}
          label={label}
          titleId={titleId}
          shouldUnmountOnExit={shouldUnmountOnExit}
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
          overrides={overrides}
          autoFocusFirstElem={autoFocusFirstElem}
          isFocusLockEnabled={isFocusLockEnabled}
          shouldReturnFocus={shouldReturnFocus}
        >
          {children}
        </DrawerPrimitive>
      </Portal>
    );
  }
}

export default withAnalyticsContext({
  componentName: 'drawer',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(DrawerBase));
