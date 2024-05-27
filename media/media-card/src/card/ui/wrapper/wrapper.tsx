/**@jsx jsx */
import { jsx } from '@emotion/react';
import { newFileExperienceClassName } from '../../cardConstants';
import { wrapperStyles } from './styles';
import { type WrapperProps } from './types';

export const Wrapper = (props: WrapperProps) => {
  const {
    testId,
    dimensions,
    appearance,
    onClick,
    onMouseEnter,
    innerRef,
    breakpoint,
    mediaCardCursor,
    disableOverlay,
    selected,
    displayBackground,
    isPlayButtonClickable,
    isTickBoxSelectable,
    shouldDisplayTooltip,
  } = props;

  return (
    <div
      id="newFileExperienceWrapper"
      className={newFileExperienceClassName}
      data-testid={testId}
      css={wrapperStyles({
        breakpoint,
        dimensions,
        appearance,
        disableOverlay,
        displayBackground,
        selected,
        isPlayButtonClickable,
        isTickBoxSelectable,
        shouldDisplayTooltip,
        mediaCardCursor,
      })}
      ref={innerRef}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {props.children}
    </div>
  );
};
