/** @jsx jsx */
import { jsx } from '@emotion/core';
import { B400 } from '@atlaskit/theme/colors';

export interface LinkProps {
  url: string;
  testId?: string;
  className?: string;
}
export const Link = ({ url, testId = 'block-card', className }: LinkProps) => {
  return (
    <span
      data-testid={`${testId}-link`}
      className={className}
      css={{ color: B400, wordBreak: 'break-all' }}
    >
      {url}
    </span>
  );
};
