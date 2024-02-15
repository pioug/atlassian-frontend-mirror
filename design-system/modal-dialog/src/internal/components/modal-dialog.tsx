/** @jsx jsx */
import { CSSProperties, useMemo } from 'react';

import { css, Global, jsx } from '@emotion/react';
import { useUID } from 'react-uid';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import FocusRing from '@atlaskit/focus-ring';
import { useCloseOnEscapePress } from '@atlaskit/layering';
import FadeIn from '@atlaskit/motion/fade-in';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { media } from '@atlaskit/primitives';
import { N0, N30A, N60A } from '@atlaskit/theme/colors';
import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

import type { KeyboardOrMouseEvent, ModalDialogProps } from '../../types';
import { borderRadius, textColor } from '../constants';
import { ModalContext, ScrollContext } from '../context';
import useOnMotionFinish from '../hooks/use-on-motion-finish';
import { dialogHeight, dialogWidth } from '../utils';

import Positioner from './positioner';

// reset pointer-events on iframe inside modal
const resetPointerEventsOnIframeStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  'iframe:is([aria-modal] iframe)': {
    pointerEvents: 'auto',
  },
});

const dialogStyles = css({
  display: 'flex',

  width: '100%',
  maxWidth: '100vw',

  height: '100%',
  minHeight: 0,
  maxHeight: '100vh',

  // Flex-grow set to 0 to prevent this element from filling its parent flexbox container
  flex: '0 1 auto',
  flexDirection: 'column',

  backgroundColor: token('elevation.surface.overlay', N0),
  color: textColor,
  [CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay', N0),
  pointerEvents: 'auto',

  [media.above.xs]: {
    width: 'var(--modal-dialog-width)',
    maxWidth: 'inherit',
    borderRadius: borderRadius,
    boxShadow: token(
      'elevation.shadow.overlay',
      `0 0 0 1px ${N30A}, 0 2px 1px ${N30A}, 0 0 20px -6px ${N60A}`,
    ),
    marginInlineEnd: 'inherit',
    marginInlineStart: 'inherit',
  },

  /**
   * This is to support scrolling if the modal's children are wrapped in
   * a form.
   */
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
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

  [media.above.xs]: {
    minHeight: 'var(--modal-dialog-height)',
  },
});

const bodyScrollStyles = css({
  [media.above.xs]: {
    height: 'var(--modal-dialog-height)',
    maxHeight: 'inherit',
  },
});

const ModalDialog = (
  props: ModalDialogProps & { onClose: (value: KeyboardOrMouseEvent) => void },
) => {
  const {
    width = 'medium',
    shouldScrollInViewport = false,
    shouldCloseOnEscapePress,
    autoFocus,
    stackIndex,
    onClose,
    onCloseComplete,
    onOpenComplete,
    height,
    children,
    label,
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

  const modalDialogContext = useMemo(
    () => ({ testId, titleId, onClose }),
    [testId, titleId, onClose],
  );

  useCloseOnEscapePress({
    onClose,
    isDisabled: !shouldCloseOnEscapePress,
  });

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
              <FocusRing>
                {/* TODO: Use `dialog` element instead of overriding section semantics (DSP-11588) */}
                <section
                  {...bottomFadeInProps}
                  aria-label={label}
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
                  aria-labelledby={label ? undefined : titleId}
                  data-testid={testId}
                  data-modal-stack={stackIndex}
                  tabIndex={-1}
                  aria-modal={true}
                >
                  {children}
                  {getBooleanFF('platform.design-system-team.iframe_gojiv') && (
                    <Global styles={resetPointerEventsOnIframeStyles} />
                  )}
                </section>
              </FocusRing>
            )}
          </FadeIn>
        </ScrollContext.Provider>
      </ModalContext.Provider>
    </Positioner>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default ModalDialog;
