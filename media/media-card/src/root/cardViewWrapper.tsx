/**@jsx jsx */
import { jsx } from '@emotion/react';
import { WrapperProps } from './types';
import { wrapperStyles } from './styles';

export const Wrapper = (props: WrapperProps) => {
  const {
    testId,
    shouldUsePointerCursor,
    breakpointSize,
    dimensions,
    onClick,
    onMouseEnter,
    innerRef,
  } = props;
  return (
    <div
      id="cardViewWrapper"
      data-testid={testId}
      css={wrapperStyles({
        shouldUsePointerCursor,
        breakpointSize,
        dimensions,
      })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      ref={innerRef}
    >
      {props.children}
    </div>
  );
};
