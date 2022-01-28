/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { FC } from 'react';

interface DescriptionProps {
  testId?: string;
  color: string;
}

const descriptionStyles = css({
  /* height is defined as 5 lines maximum by design */
  maxHeight: 100,
  overflow: 'auto',
  wordWrap: 'break-word',
});

const Description: FC<DescriptionProps> = ({ color, testId, children }) => (
  <div style={{ color }} css={descriptionStyles} data-testid={testId}>
    {children}
  </div>
);

export default Description;
