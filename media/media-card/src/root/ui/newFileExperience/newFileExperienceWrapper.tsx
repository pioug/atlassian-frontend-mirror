/**@jsx jsx */
import { jsx } from '@emotion/react';
import { newFileExperienceClassName } from '../../../root/card/cardConstants';
import { newFileExperienceWrapperStyles } from './styles';
import { NewFileExperienceWrapperProps } from './types';

export const NewFileExperienceWrapper = (
  props: NewFileExperienceWrapperProps,
) => {
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
      css={newFileExperienceWrapperStyles({
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
