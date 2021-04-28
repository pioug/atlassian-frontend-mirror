/** @jsx jsx */
import { forwardRef, HTMLAttributes, Ref } from 'react';

import { jsx } from '@emotion/core';

import useScrollbarWidth from '@atlaskit/ds-lib/use-scrollbar-width';

import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

import { containerCSS, innerContainerCSS, outerContainerCSS } from './styles';

export interface NavigationContentProps {
  children: React.ReactNode;

  /**
   * Forces the top scroll indicator to be shown all the time.
   */
  showTopScrollIndicator?: boolean;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

const NavigationContent = forwardRef<
  HTMLElement,
  // We place HTMLAttributes here so ERT doesn't blow up.
  NavigationContentProps & HTMLAttributes<HTMLElement>
>((props: NavigationContentProps, ref) => {
  const { showTopScrollIndicator, children } = props;
  const { shouldRender } = useShouldNestedElementRender();
  const scrollbar = useScrollbarWidth();

  if (!shouldRender) {
    return children as JSX.Element;
  }

  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      css={outerContainerCSS({
        showTopScrollIndicator,
        scrollbarWidth: scrollbar.width,
      })}
    >
      <div
        ref={scrollbar.ref}
        css={innerContainerCSS({ showTopScrollIndicator })}
      >
        <div css={containerCSS({ showTopScrollIndicator })}>{children}</div>
      </div>
    </div>
  );
});

export default NavigationContent;
