/**@jsx jsx */
import { jsx } from '@emotion/react';
import { InlinePlayerWrapperProps } from './types';
import {
  inlinePlayerWrapperStyles,
  inlinePlayerClassName,
} from './inlinePlayerWrapperStyles';

export const InlinePlayerWrapper = (props: InlinePlayerWrapperProps) => {
  const { testId, selected, dimensions, onClick, innerRef } = props;
  return (
    <div
      id="inlinePlayerWrapper"
      data-testid={testId}
      className={inlinePlayerClassName}
      css={inlinePlayerWrapperStyles({
        selected,
        dimensions,
      })}
      onClick={onClick}
      ref={innerRef}
    >
      {props.children}
    </div>
  );
};
