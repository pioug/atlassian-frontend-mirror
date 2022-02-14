/**  @jsx jsx */
import { ReactElement } from 'react';

import { css, jsx } from '@emotion/core';

export type EllipsisPropType = {
  key: string;
};

const ellipsisStyles = css({
  display: 'inline-flex',
  padding: '0 8px',
  alignItems: 'center',
  textAlign: 'center',
});

export default function renderEllipsis({
  key,
}: EllipsisPropType): ReactElement {
  return (
    <span key={key} css={ellipsisStyles}>
      ...
    </span>
  );
}
