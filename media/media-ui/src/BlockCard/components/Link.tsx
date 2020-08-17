/** @jsx jsx */
import { jsx } from '@emotion/core';
import { B400 } from '@atlaskit/theme/colors';

export interface LinkProps {
  url: string;
  testId?: string;
}
export const Link = ({ url, testId = 'block-card' }: LinkProps) => {
  return (
    <span
      data-testid={`${testId}-link`}
      css={{ color: B400, wordBreak: 'break-all' }}
    >
      {url}
    </span>
  );
};
