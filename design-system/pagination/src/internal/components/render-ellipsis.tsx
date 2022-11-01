/**  @jsx jsx */
import { ReactElement } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export type EllipsisProp = {
  key: string;
};

const ellipsisStyles = css({
  display: 'inline-flex',
  padding: `${token('spacing.scale.0', '0px')} ${token(
    'spacing.scale.100',
    '8px',
  )}`,
  alignItems: 'center',
  textAlign: 'center',
});

export default function renderEllipsis({ key }: EllipsisProp): ReactElement {
  return (
    <span key={key} css={ellipsisStyles}>
      ...
    </span>
  );
}
