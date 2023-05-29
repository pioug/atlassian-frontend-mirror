/** @jsx jsx */

import { useCallback } from 'react';

import { css, jsx } from '@emotion/react';
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
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  top: 0,
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  left: 0,

  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
});

const whiteListElements = (element: HTMLElement) => {
  // allows focus to reach elements outside the modal if they contain the data-atlas-extension attribute
  return !element.hasAttribute('data-atlas-extension');
};

/**
 * __Modal wrapper__
 *
 * A modal wrapper displays content that requires user interaction, in a layer above the page.
 * This component is primary container for other modal components.
 *
 * - [Examples](https://atlassian.design/components/modal-dialog/examples)
 * - [Code](https://atlassian.design/components/modal-dialog/code)
 * - [Usage](https://atlassian.design/components/modal-dialog/usage)
 */
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
    children,
    height,
    width,
    onCloseComplete,
    onOpenComplete,
    testId,
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
        height={height}
        width={width}
        onCloseComplete={onCloseComplete}
        onOpenComplete={onOpenComplete}
      >
        {children}
      </ModalDialog>
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
              returnFocus
              whiteList={whiteListElements}
            >
              {/* Ensures scroll events are blocked on the document body and locked */}
              <ScrollLock />
              {/* TouchScrollable makes the whole modal dialog scrollable when scroll boundary is set to viewport. */}
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
