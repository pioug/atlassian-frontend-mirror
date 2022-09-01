/**  @jsx jsx */
import { ReactElement } from 'react';

import { css, jsx } from '@emotion/react';

export type EllipsisProp = {
  key: string;
};

const ellipsisStyles = css({
  display: 'inline-flex',
  padding: '0 8px',
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
