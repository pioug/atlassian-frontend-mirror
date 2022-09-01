/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC } from 'react';

interface DescriptionProps {
  testId?: string;
  color: string;
  isBold: boolean;
}

const descriptionStyles = css({
  maxHeight: 100, // height is defined as 5 lines maximum by design
  overflow: 'auto',
  wordWrap: 'break-word',
});

const Description: FC<DescriptionProps> = ({
  color,
  testId,
  children,
  isBold,
}) => (
  <div style={{ color }} css={[descriptionStyles]} data-testid={testId}>
    {children}
  </div>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Description;
