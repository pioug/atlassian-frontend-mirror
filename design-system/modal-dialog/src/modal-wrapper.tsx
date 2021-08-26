/** @jsx jsx */

import { useCallback } from 'react';

import { css, jsx } from '@emotion/core';
import FocusLock from 'react-focus-lock';
import ScrollLock, { TouchScrollable } from 'react-scrolllock';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import Blanket from '@atlaskit/blanket';
import noop from '@atlaskit/ds-lib/noop';
import useCloseOnEscapePress from '@atlaskit/ds-lib/use-close-on-escape-press';
import FadeIn from '@atlaskit/motion/fade-in';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import ModalDialog from './internal/components/modal-dialog';
import useModalStack from './internal/hooks/use-modal-stack';
import usePreventProgrammaticScroll from './internal/hooks/use-prevent-programmatic-scroll';
import type { ModalDialogProps } from './types';

export type { ModalDialogProps };

const fillScreenStyles = css({
  width: '100vw',
  height: '100vh',

  position: 'fixed',
  top: 0,
  left: 0,

  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
});

const ModalWrapper = (props: ModalDialogProps) => {
  const {
    autoFocus = true,
    shouldCloseOnEscapePress = true,
    shouldCloseOnOverlayClick = true,
    shouldScrollInViewport = false,
    stackIndex: stackIndexOverride,
    onClose = noop,
    onStackChange = noop,
    isBlanketHidden,
    testId,
    ...modalDialogProps
  } = props;

  const calculatedStackIndex = useModalStack({ onStackChange });
  const stackIndex = stackIndexOverride || calculatedStackIndex;
  const isForeground = stackIndex === 0;

  // When a user supplies a ref to focus we skip auto focus via react-focus-lock
  const autoFocusLock = typeof autoFocus === 'boolean' ? autoFocus : false;

  const onCloseHandler = usePlatformLeafEventHandler({
    fn: onClose,
    action: 'closed',
    componentName: 'modalDialog',
    packageName: process.env._PACKAGE_NAME_!,
    packageVersion: process.env._PACKAGE_VERSION_!,
  });

  const onBlanketClicked = useCallback(
    (e) => {
      if (shouldCloseOnOverlayClick) {
        onCloseHandler(e);
      }
    },
    [shouldCloseOnOverlayClick, onCloseHandler],
  );

  usePreventProgrammaticScroll();

  useCloseOnEscapePress({
    onClose: onCloseHandler,
    isDisabled: !shouldCloseOnEscapePress || !isForeground,
  });

  const modalDialogWithBlanket = (
    <Blanket
      isTinted={!isBlanketHidden}
      onBlanketClicked={onBlanketClicked}
      testId={testId && `${testId}--blanket`}
    >
      <ModalDialog
        testId={testId}
        autoFocus={autoFocus}
        stackIndex={stackIndex}
        onClose={onCloseHandler}
        shouldScrollInViewport={shouldScrollInViewport}
        {...modalDialogProps}
      />
    </Blanket>
  );

  return (
    <Portal zIndex={layers.modal()}>
      <FadeIn>
        {(fadeInProps) => (
          <div
            {...fadeInProps}
            css={fillScreenStyles}
            aria-hidden={!isForeground}
          >
            <FocusLock
              autoFocus={autoFocusLock}
              disabled={!isForeground}
              returnFocus
            >
              {/**
               * Ensures scroll events are blocked on the document body and locked
               * on the modal dialog.
               */}
              <ScrollLock />
              {/**
               * TouchScrollable makes the whole modal dialog scrollable when
               * scroll boundary is set to viewport.
               */}
              {shouldScrollInViewport ? (
                <TouchScrollable>{modalDialogWithBlanket}</TouchScrollable>
              ) : (
                modalDialogWithBlanket
              )}
            </FocusLock>
          </div>
        )}
      </FadeIn>
    </Portal>
  );
};

export default ModalWrapper;
