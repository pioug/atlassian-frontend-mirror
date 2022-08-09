/** @jsx jsx */

import { useCallback, useRef } from 'react';

import { css, jsx } from '@emotion/core';

import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import {
  ExitingPersistence,
  SlideIn,
  Transition,
  useExitingPersistence,
} from '@atlaskit/motion';
import type { SlideInProps } from '@atlaskit/motion/types';
import { N0 } from '@atlaskit/theme/colors';
import { gridSize, layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { animationTimingFunction, transitionDurationMs } from '../../constants';
import {
  DrawerPrimitiveDefaults,
  DrawerPrimitiveOverrides,
  DrawerPrimitiveProps,
  Widths,
} from '../types';
import { createExtender } from '../utils';

import ContentOverrides from './content';
import IconButton from './icon-button';
import SidebarOverrides from './sidebar';

// Misc.
// ------------------------------

const widths: Widths = {
  full: '100vw',
  extended: '95vw',
  narrow: 45 * gridSize(),
  medium: 60 * gridSize(),
  wide: 75 * gridSize(),
};

const wrapperStyles = css({
  display: 'flex',
  height: '100vh',
  position: 'fixed',
  zIndex: layers.blanket() + 1,
  top: 0,
  left: 0,
  backgroundColor: token('elevation.surface.overlay', N0),
  overflow: 'hidden',
});

const defaults: DrawerPrimitiveDefaults = {
  Sidebar: SidebarOverrides,
  Content: ContentOverrides,
};

/**
 * This wrapper is used to specify separate durations for enter and exit.
 */
const CustomSlideIn = ({
  children,
  onFinish,
}: Pick<SlideInProps, 'children' | 'onFinish'>) => {
  const { isExiting } = useExitingPersistence();

  /**
   * The actual duration should be the same for both enter and exit,
   * but motion halves the passed duration for exit animations,
   * so we double it when exiting.
   */
  const duration = isExiting ? transitionDurationMs * 2 : transitionDurationMs;

  return (
    <SlideIn
      animationTimingFunction={animationTimingFunction}
      duration={duration}
      enterFrom="left"
      exitTo="left"
      fade="none"
      onFinish={onFinish}
    >
      {children}
    </SlideIn>
  );
};

const DrawerPrimitive = ({
  children,
  icon: Icon,
  onClose,
  onCloseComplete,
  onOpenComplete,
  overrides,
  testId,
  in: isOpen,
  ...props
}: DrawerPrimitiveProps) => {
  const getOverrides = createExtender<
    DrawerPrimitiveDefaults,
    DrawerPrimitiveOverrides
  >(defaults, overrides);

  const { component: Sidebar, ...sideBarOverrides } = getOverrides('Sidebar');
  const { component: Content, ...contentOverrides } = getOverrides('Content');

  const ref = useRef<HTMLDivElement>(null);

  const onFinish = useCallback(
    (state: Transition) => {
      if (state === 'entering') {
        onOpenComplete?.(ref.current);
      } else if (state === 'exiting') {
        onCloseComplete?.(ref.current);
      }
    },
    [onCloseComplete, onOpenComplete],
  );

  return (
    <ExitingPersistence appear>
      {isOpen && (
        <CustomSlideIn onFinish={onFinish}>
          {({ className }) => (
            <div
              className={className}
              css={wrapperStyles}
              style={{
                width: widths[props.width ?? 'narrow'],
              }}
              data-testid={testId}
              ref={ref}
            >
              <Sidebar {...sideBarOverrides}>
                <IconButton
                  onClick={onClose}
                  testId={testId && 'DrawerPrimitiveSidebarCloseButton'}
                >
                  {Icon ? (
                    <Icon size="large" />
                  ) : (
                    <ArrowLeft label="Close drawer" />
                  )}
                </IconButton>
              </Sidebar>
              <Content {...contentOverrides}>{children}</Content>
            </div>
          )}
        </CustomSlideIn>
      )}
    </ExitingPersistence>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default DrawerPrimitive;
