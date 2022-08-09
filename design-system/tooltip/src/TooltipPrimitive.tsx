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
  onMouseOver?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseOut?: (e: React.MouseEvent<HTMLElement>) => void;
  id?: string;
}

const VAR_PRIMITIVE_ZINDEX = 'tooltipPrimitiveZindex';

const primitiveStyles = css({
  zindex: `var(${VAR_PRIMITIVE_ZINDEX})`,
  cursor: `default`,
});

const TooltipPrimitive = forwardRef<HTMLDivElement, TooltipPrimitiveProps>(
  function TooltipPrimitive(
    {
      style,
      className,
      children,
      placement,
      testId,
      onMouseOut,
      onMouseOver,
      id,
    },
    ref,
  ) {
    const styleWithZIndex = {
      ...style,
      [VAR_PRIMITIVE_ZINDEX]: layers.tooltip(),
    };
    return (
      <div
        ref={ref}
        style={styleWithZIndex}
        data-testid={testId ? `${testId}--wrapper` : undefined}
      >
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
        <div
          role="tooltip"
          className={className}
          onMouseOut={onMouseOut}
          onMouseOver={onMouseOver}
          css={primitiveStyles}
          data-placement={placement}
          data-testid={testId}
          id={id}
        >
          {children}
        </div>
      </div>
    );
  },
);

TooltipPrimitive.displayName = 'TooltipPrimitive';

export default TooltipPrimitive;
