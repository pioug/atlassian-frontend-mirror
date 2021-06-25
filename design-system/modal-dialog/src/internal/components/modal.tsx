/** @jsx jsx */
import { useCallback, useMemo } from 'react';

import { jsx } from '@emotion/core';
import FocusLock from 'react-focus-lock';
import { useUID } from 'react-uid';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import Blanket from '@atlaskit/blanket';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import useCloseOnEscapePress from '@atlaskit/ds-lib/use-close-on-escape-press';
import FadeIn from '@atlaskit/motion/fade-in';

import useOnMotionFinish from '../hooks/use-on-motion-finish';
import usePreventProgrammaticScroll from '../hooks/use-prevent-programmatic-scroll';
import { getDialogStyles, getFillScreenStyles } from '../styles/modal';
import type { ModalDialogProps } from '../types';

import Content from './content';
import Positioner from './positioner';

type ForcedRequired = 'onClose' | 'stackIndex' | 'scrollBehavior';

interface ModalDialogInnerProps
  extends Omit<ModalDialogProps, ForcedRequired>,
    Required<Pick<ModalDialogProps, ForcedRequired>> {}

function ModalDialogInner(props: ModalDialogInnerProps) {
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
    onClose,
    onCloseComplete,
    onOpenComplete,
    shouldCloseOnEscapePress,
    shouldCloseOnOverlayClick,
    stackIndex,
    heading,
    width,
    scrollBehavior,
    testId,
  } = props;

  const id = useUID();
  const scrollDistance = usePreventProgrammaticScroll();
  const isForeground = stackIndex === 0;

  const onCloseHandler = usePlatformLeafEventHandler({
    fn: onClose,
    action: 'closed',
    componentName: 'modalDialog',
    packageName: process.env._PACKAGE_NAME_!,
    packageVersion: process.env._PACKAGE_VERSION_!,
  });

  useCloseOnEscapePress({
    onClose: onCloseHandler,
    isDisabled: !shouldCloseOnEscapePress || !isForeground,
  });

  const [motionRef, onMotionFinish] = useOnMotionFinish({
    onOpenComplete,
    onCloseComplete,
  });

  const onBlanketClicked = useCallback(
    (e) => {
      if (shouldCloseOnOverlayClick) {
        onCloseHandler(e);
      }
    },
    [shouldCloseOnOverlayClick, onCloseHandler],
  );

  useAutoFocus(
    typeof autoFocus === 'object' ? autoFocus : undefined,
    // When a user supplies  a ref to focus we enable this hook
    typeof autoFocus === 'object',
  );

  const fillScreenStyles = useMemo(() => {
    return getFillScreenStyles(scrollDistance);
  }, [scrollDistance]);

  const dialogStyles = useMemo(() => {
    return getDialogStyles({ isChromeless, height, width });
  }, [isChromeless, height, width]);

  return (
    <FadeIn>
      {(fadeInProps) => (
        <div
          {...fadeInProps}
          css={fillScreenStyles}
          aria-hidden={!isForeground}
        >
          <FocusLock
            autoFocus={
              // When a user supplies a ref to focus we skip focusing automatically
              typeof autoFocus === 'boolean' ? autoFocus : false
            }
            disabled={!isForeground}
            returnFocus
          >
            <Blanket
              isTinted={!isBlanketHidden}
              onBlanketClicked={onBlanketClicked}
              testId={testId && `${testId}--blanket`}
            />
            <Positioner
              scrollBehavior={scrollBehavior}
              stackIndex={stackIndex}
              testId={testId}
            >
              <FadeIn entranceDirection="bottom" onFinish={onMotionFinish}>
                {(bottomFadeInProps) => (
                  <section
                    {...bottomFadeInProps}
                    ref={mergeRefs([bottomFadeInProps.ref, motionRef])}
                    css={dialogStyles}
                    role="dialog"
                    aria-labelledby={`dialog-heading-${id}`}
                    data-testid={testId}
                    tabIndex={-1}
                    aria-modal={true}
                  >
                    <Content
                      actions={actions}
                      appearance={appearance}
                      components={components}
                      header={header}
                      body={body}
                      footer={footer}
                      heading={heading}
                      headingId={`dialog-heading-${id}`}
                      testId={testId && `${testId}-dialog-content`}
                      isChromeless={isChromeless}
                      isHeadingMultiline={isHeadingMultiline}
                      onClose={onCloseHandler}
                      stackIndex={stackIndex}
                      shouldScroll={
                        scrollBehavior === 'inside' ||
                        scrollBehavior === 'inside-wide'
                      }
                    >
                      {children}
                    </Content>
                  </section>
                )}
              </FadeIn>
            </Positioner>
          </FocusLock>
        </div>
      )}
    </FadeIn>
  );
}

export default ModalDialogInner;
