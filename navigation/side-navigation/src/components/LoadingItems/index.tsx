/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { ExitingPersistence, FadeIn, mediumDurationMs } from '@atlaskit/motion';

import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export interface LoadingItemsProps {
  /**
   * Child items that will be loaded asynchronously.
   */
  children: React.ReactNode;

  /**
   * Fallback you want to show when loading.
   * You'll want to use the supplied [skeleton item](/packages/navigation/side-navigation/docs/skeleton-item)
   * or [skeleton heading item](/packages/navigation/side-navigation/docs/skeleton-heading-item) components.
   */
  fallback: React.ReactNode;

  /**
   * Used to show either the loading fallback or the loaded contents.
   * Will cross fade between children and fallback when this is flipped.
   */
  isLoading?: boolean;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   *
   * Will set these elements when defined:
   * - The entering container - `{testId}--entering`
   * - The exiting container - `{testId}--exiting`
   */
  testId?: string;
}

const baseMotionStyles = css({
  position: 'absolute',
  zIndex: 1,
  top: 0,
  right: 0,
  left: 0,
});

const enteringStyles = css({
  position: 'static',
  zIndex: 2,
});

/**
 * __Loading items__
 *
 * Loading items conditionally render based on the useShouldNestedElementRender() hook.
 */
const LoadingItems = ({
  children,
  isLoading,
  fallback,
  testId,
}: LoadingItemsProps) => {
  const { shouldRender } = useShouldNestedElementRender();
  if (!shouldRender) {
    return children as JSX.Element;
  }

  return (
    <ExitingPersistence>
      <FadeIn key={`loading-section-${isLoading}`} duration={mediumDurationMs}>
        {(motion, state) => (
          <span
            {...motion}
            data-testid={testId && `${testId}--${state}`}
            css={[baseMotionStyles, state === 'entering' && enteringStyles]}
          >
            {isLoading ? fallback : children}
          </span>
        )}
      </FadeIn>
    </ExitingPersistence>
  );
};

export default LoadingItems;
