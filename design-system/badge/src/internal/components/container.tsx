/** @jsx jsx */
import { ReactNode, Ref } from 'react';

import { css, jsx } from '@emotion/core';

import type { ThemeTokens } from '../theme';

const containerStyles = css({
  borderRadius: '24px',
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: 'normal',
  lineHeight: 1,
  minWidth: '1px',
  padding: '2px 6px',
  textAlign: 'center',
});

interface ContainerProps extends ThemeTokens {
  children: ReactNode;
  // TODO: Temporary solution to mimic styled components behavior. Will remove once we stop
  // exporting `Container` in the final PR.
  innerRef?: ((instance: any) => void) | Ref<HTMLSpanElement>;
}

/**
 * __Container__
 *
 * This component retains the styling of a normal badge, but without formatting.
 * This means you can compose in whatever information you need to.
 *
 * - [Examples](https://atlassian.design/components/badge/badge-container/examples)
 * - [Code](https://atlassian.design/components/badge/badge-container/code)
 * - [Usage](https://atlassian.design/components/badge/badge-container/usage)
 */
function Container({
  backgroundColor,
  textColor,
  innerRef,
  ...restProps
}: ContainerProps) {
  return (
    <span
      {...restProps}
      ref={innerRef}
      css={containerStyles}
      style={{
        backgroundColor,
        color: textColor,
      }}
    />
  );
}

export default Container;
