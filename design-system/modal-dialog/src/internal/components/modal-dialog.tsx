/** @jsx jsx */
import { CSSProperties, useMemo } from 'react';

import { css, jsx } from '@emotion/core';
import { useUID } from 'react-uid';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import FadeIn from '@atlaskit/motion/fade-in';
import { N0, N30A, N60A } from '@atlaskit/theme/colors';

import type { ModalDialogProps } from '../../types';
import { borderRadius, textColor } from '../constants';
import { ModalContext, ScrollContext } from '../context';
import useOnMotionFinish from '../hooks/use-on-motion-finish';
import { dialogHeight, dialogWidth } from '../utils';

import Positioner from './positioner';

const dialogStyles = css({
  display: 'flex',

  width: '100%',
  maxWidth: '100vw',

  height: '100%',
  minHeight: 0,
  maxHeight: '100vh',

  flex: '1 1 auto',
  flexDirection: 'column',

  backgroundColor: N0,
  color: textColor,
  pointerEvents: 'auto',

  '@media (min-width: 480px)': {
    width: 'var(--modal-dialog-width)',
    maxWidth: 'inherit',

    marginRight: 'inherit',
    marginLeft: 'inherit',

    borderRadius,
    boxShadow: `0 0 0 1px ${N30A}, 0 2px 1px ${N30A}, 0 0 20px -6px ${N60A}`,
  },

  /**
   * This is to support scrolling if the modal's children are wrapped in
   * a form.
   */
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > form:only-child': {
    display: 'inherit',
    maxHeight: 'inherit',
    flexDirection: 'inherit',
  },
});

const viewportScrollStyles = css({
  /**
   * This ensures that the element fills the viewport on mobile
   * while also allowing it to overflow if its height is larger than
   * the viewport.
   */
  minHeight: '100vh',
  maxHeight: 'none',

  '@media (min-width: 480px)': {
    minHeight: 'var(--modal-dialog-height)',
  },
});

const bodyScrollStyles = css({
  '@media (min-width: 480px)': {
    height: 'var(--modal-dialog-height)',
    maxHeight: 'inherit',
  },
});

const ModalDialog = (props: ModalDialogProps) => {
  const {
    width = 'medium',
    shouldScrollInViewport = false,
    autoFocus,
    stackIndex,
    onClose,
    onCloseComplete,
    onOpenComplete,
    height,
    children,
    testId,
  } = props;

  const id = useUID();
  const titleId = `modal-dialog-title-${id}`;

  useAutoFocus(
    typeof autoFocus === 'object' ? autoFocus : undefined,
    // When a user supplies  a ref to focus we enable this hook
    typeof autoFocus === 'object',
  );

  const [motionRef, onMotionFinish] = useOnMotionFinish({
    onOpenComplete,
    onCloseComplete,
  });

  const modalDialogContext = useMemo(() => ({ testId, titleId, onClose }), [
    testId,
    titleId,
    onClose,
  ]);

  return (
    <Positioner
      stackIndex={stackIndex!}
      shouldScrollInViewport={shouldScrollInViewport}
      testId={testId}
    >
      <ModalContext.Provider value={modalDialogContext}>
        <ScrollContext.Provider value={shouldScrollInViewport}>
          <FadeIn entranceDirection="bottom" onFinish={onMotionFinish}>
            {(bottomFadeInProps) => (
              <section
                {...bottomFadeInProps}
                ref={mergeRefs([bottomFadeInProps.ref, motionRef])}
                style={
                  {
                    '--modal-dialog-width': dialogWidth(width),
                    '--modal-dialog-height': dialogHeight(height),
                  } as CSSProperties
                }
                css={[
                  dialogStyles,
                  shouldScrollInViewport
                    ? viewportScrollStyles
                    : bodyScrollStyles,
                ]}
                role="dialog"
                aria-labelledby={titleId}
                data-testid={testId}
                data-modal-stack={stackIndex}
                tabIndex={-1}
                aria-modal={true}
              >
                {children}
              </section>
            )}
          </FadeIn>
        </ScrollContext.Provider>
      </ModalContext.Provider>
    </Positioner>
  );
};

export default ModalDialog;
