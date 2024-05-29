/** @jsx jsx */
import { jsx } from '@emotion/react';
import { B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export interface LinkProps {
  url: string;
  testId?: string;
  className?: string;
}
export const Link = ({ url, testId = 'block-card', className }: LinkProps) => {
  return (
    <span
      data-testid={`${testId}-link`}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
      className={className}
      css={{ color: token('color.link', B400), wordBreak: 'break-all' }}
    >
      {url}
    </span>
  );
};
