/** @jsx jsx */

import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import rafSchedule from 'raf-schd';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import noop from '@atlaskit/ds-lib/noop';
import useLazyCallback from '@atlaskit/ds-lib/use-lazy-callback';
import useStateRef from '@atlaskit/ds-lib/use-state-ref';
import FocusRing from '@atlaskit/focus-ring';
import { media } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { keylineColor, keylineHeight } from '../constants';

const baseStyles = css({
  display: 'inherit',
  margin: token('space.0', '0px'),
  flex: 'inherit',
  flexDirection: 'inherit',
  flexGrow: 1,
  overflowX: 'hidden',
  overflowY: 'auto',
  [media.above.xs]: {
    height: 'unset',
    overflowY: 'auto',
  },
});

const topKeylineStyles = css({
  borderTop: `${keylineHeight}px solid ${keylineColor}`,
});

const bottomKeylineStyles = css({
  borderBottom: `${keylineHeight}px solid ${keylineColor}`,
});

interface ScrollContainerProps {
  /**
   * Children of the body within modal dialog.
   */
  children: React.ReactNode;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

/**
 * A container that shows top and bottom keylines when the
 * content overflows into the scrollable element.
 */
const ScrollContainer = forwardRef<HTMLElement | null, ScrollContainerProps>(
  (props, ref) => {
    const { testId, children } = props;
    const [hasSiblings, setSiblings] = useStateRef({
      previous: false,
      next: false,
    });

    const [showContentFocus, setContentFocus] = useState(false);
    const [showTopKeyline, setTopKeyline] = useState(false);
    const [showBottomKeyline, setBottomKeyline] = useState(false);

    const scrollableRef = useRef<HTMLDivElement>(null);

    const setLazySiblings = useLazyCallback(setSiblings);

    const setLazyContentFocus = useLazyCallback(
      rafSchedule(() => {
        const target = scrollableRef.current;
        target && setContentFocus(target.scrollHeight > target.clientHeight);
      }),
    );

    const setLazyKeylines = useLazyCallback(
      rafSchedule(() => {
        const target = scrollableRef.current;
        if (target) {
          const scrollableDistance = target.scrollHeight - target.clientHeight;

          if (hasSiblings.current.previous) {
            setTopKeyline(target.scrollTop > keylineHeight);
          }

          if (hasSiblings.current.next) {
            setBottomKeyline(
              target.scrollTop <= scrollableDistance - keylineHeight,
            );
          }
        }
      }),
    );

    useEffect(() => {
      const target = scrollableRef.current;
      const unbindWindowEvent = bind(window, {
        type: 'resize',
        listener: setLazyKeylines,
      });
      const unbindTargetEvent = target
        ? bind(target, { type: 'scroll', listener: setLazyKeylines })
        : noop;

      setLazyContentFocus();
      setLazyKeylines();
      setLazySiblings({
        previous: Boolean(target?.previousElementSibling),
        next: Boolean(target?.nextElementSibling),
      });

      return () => {
        unbindWindowEvent();
        unbindTargetEvent();
      };
    }, [setLazyContentFocus, setLazyKeylines, setLazySiblings]);

    return (
      <FocusRing isInset>
        <div
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={showContentFocus ? 0 : undefined}
          aria-label={showContentFocus ? 'Scrollable content' : undefined}
          data-testid={testId && `${testId}--scrollable`}
          ref={mergeRefs([ref, scrollableRef])}
          css={[
            baseStyles,
            showTopKeyline && topKeylineStyles,
            showBottomKeyline && bottomKeylineStyles,
          ]}
        >
          {children}
        </div>
      </FocusRing>
    );
  },
);

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
