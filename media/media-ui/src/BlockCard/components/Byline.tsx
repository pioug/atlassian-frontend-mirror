/** @jsx jsx */
import { jsx } from '@emotion/core';
import { N300 } from '@atlaskit/theme/colors';
import { gs } from '../utils';

export interface BylineProps {
  /* Text to be displayed in the body of the card. */
  text?: string;
  testId?: string;
  children?: React.ReactNode;
}

export const Byline = ({ text, children, testId }: BylineProps) => (
  <span
    css={{
      marginTop: gs(1.5),
      fontSize: gs(1.5),
      lineHeight: gs(2.5),
      color: `${N300}`,
      fontWeight: 'normal',
      // Spec: only allow two lines MAX to be shown.
      display: '-webkit-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      // Fallback options.
      maxHeight: gs(5),
    }}
    data-testid={testId}
  >
    {text || children}
  </span>
);
