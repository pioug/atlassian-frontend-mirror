/** @jsx jsx */

import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { jsx } from '@emotion/core';
import rafSchedule from 'raf-schd';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useLazyCallback from '@atlaskit/ds-lib/use-lazy-callback';
import useStateRef from '@atlaskit/ds-lib/use-state-ref';

import { keylineHeight } from '../constants';
import { scrollableStyles } from '../styles/scroll-container';

interface ScrollContainerProps {
  /**
   * Enables the body to scroll within the modal dialog.
   * This is controlled by the outer modal's `scrollBehavior` prop.
   */
  shouldScroll?: boolean;

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
        const target = scrollableRef.current!;
        setContentFocus(target.scrollHeight > target.clientHeight);
      }),
    );

    const setLazyKeylines = useLazyCallback(
      rafSchedule(() => {
        const target = scrollableRef.current!;
        const scrollableDistance = target.scrollHeight - target.clientHeight;

        if (hasSiblings.current.previous) {
          setTopKeyline(target.scrollTop > keylineHeight);
        }

        if (hasSiblings.current.next) {
          setBottomKeyline(
            target.scrollTop <= scrollableDistance - keylineHeight,
          );
        }
      }),
    );

    useEffect(() => {
      const target = scrollableRef.current!;
      window.addEventListener('resize', setLazyKeylines, false);
      target.addEventListener('scroll', setLazyKeylines, false);

      setLazyContentFocus();
      setLazyKeylines();
      setLazySiblings({
        previous: Boolean(target.previousElementSibling),
        next: Boolean(target.nextElementSibling),
      });

      return () => {
        window.removeEventListener('resize', setLazyKeylines, false);
        target.removeEventListener('scroll', setLazyKeylines, false);
      };
    }, [setLazyContentFocus, setLazyKeylines, setLazySiblings]);

    return (
      <div
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={showContentFocus ? 0 : undefined}
        data-testid={props.testId && `${props.testId}--scrollable`}
        ref={mergeRefs([ref, scrollableRef])}
        css={scrollableStyles({
          showTopKeyline,
          showBottomKeyline,
          shouldScroll: props.shouldScroll,
        })}
      >
        {props.children}
      </div>
    );
  },
);

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
