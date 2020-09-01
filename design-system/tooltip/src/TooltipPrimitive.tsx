/** @jsx jsx */
import { CSSProperties, forwardRef, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { layers } from '@atlaskit/theme/constants';

import { PositionType } from './types';

export interface TooltipPrimitiveProps {
  truncate?: boolean;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
  testId?: string;
  placement: PositionType;
  ref: React.Ref<any>;
}

const primitiveCss = css`
  z-index: ${layers.tooltip()};
  pointer-events: none;
`;

const TooltipPrimitive = forwardRef<HTMLDivElement, TooltipPrimitiveProps>(
  function TooltipPrimitive(
    { style, className, children, placement, testId },
    ref,
  ) {
    return (
      <div
        role="tooltip"
        ref={ref}
        style={style}
        className={className}
        css={primitiveCss}
        data-placement={placement}
        data-testid={testId}
      >
        {children}
      </div>
    );
  },
);

TooltipPrimitive.displayName = 'TooltipPrimitive';

export default TooltipPrimitive;
