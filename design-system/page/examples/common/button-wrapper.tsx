/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const buttonWrapperStyles = css({
  display: 'flex',
  padding: 4,
  gap: 8,
  flexWrap: 'wrap',
});

export const ButtonWrapper = (props: any) => (
  <div css={buttonWrapperStyles} {...props} />
);
