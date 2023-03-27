/** @jsx jsx */

import { forwardRef, ReactElement, Ref, useCallback } from 'react';

import { jsx } from '@emotion/react';
import { useMergeRefs } from 'use-callback-ref';

import Box from '@atlaskit/ds-explorations/box';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { gridSize } from '@atlaskit/theme/constants';

import { DrawerPrimitiveProps, Widths } from '../types';

import usePreventProgrammaticScroll from './hooks/use-prevent-programmatic-scroll';

export const wrapperWidth: Widths = {
  full: { width: '100vw' },
  extended: { width: '95vw' },
  narrow: { width: 45 * gridSize() },
  medium: { width: 60 * gridSize() },
  wide: { width: 75 * gridSize() },
};

const wrapperStyles = {
  top: 0,
  left: 0,
  height: '100vh',
};

interface FocusLockRefTargetProps
  extends Pick<DrawerPrimitiveProps, 'width' | 'testId'> {
  /**
   * This must have two children explicitly as we target the second child as the Content.
   */
  children: [ReactElement, ReactElement];
  /**
   * A ref pointing to our drawer wrapper, passed to `onCloseComplete` and `onOpenComplete` callbacks.
   */
  drawerRef: Ref<HTMLDivElement>;
  /**
   * The className coming from the SlideIn render callback.
   */
  className?: string;
}

/**
 * A wrapper that controls the styling of the drawer with a few hacks with refs to get our Touch±Scroll locks working.
 */
const DrawerWrapper = forwardRef<HTMLElement, FocusLockRefTargetProps>(
  ({ children, className, width = 'narrow', testId, drawerRef }, scrollRef) => {
    /**
     * We use a callback ref to assign the `<Content />` component to the forwarded `scrollRef`.
     * This ref comes from `react-scrolllock` to allow touch scrolling, eg.: `<ScrollLock><TouchScrollable>{children}</TouchScrollable><ScrollLock>`
     *
     * This is because we do not control the `<Content />` component in order to forward a ref to it (given it can be overriden via `DrawerPrimitiveProps['overrides']['Content']['component']`).
     * Additionally, we target the last child because with `props.overrides.Sidebar.component = () => null` you only have one child.
     * If both `Sidebar.component` and `Content.component` return null you will have no children and this will throw an error, but that doesn't seem valid.
     */
    const assignSecondChildRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (node?.children?.length && typeof scrollRef === 'function') {
          scrollRef(node.children[node.children.length - 1] as HTMLElement);
        }
      },
      [scrollRef],
    );

    const ref = useMergeRefs([drawerRef, assignSecondChildRef]);

    usePreventProgrammaticScroll();

    return (
      <Box
        display="flex"
        position="fixed"
        backgroundColor="elevation.surface.overlay"
        overflow="hidden"
        layer="blanket"
        UNSAFE_style={{
          ...wrapperStyles,
          ...wrapperWidth[width],
        }}
        className={className}
        testId={testId}
        ref={ref}
      >
        {children}
      </Box>
    );
  },
);

export default DrawerWrapper;
