/**  @jsx jsx */
import { ReactElement } from 'react';

import { jsx } from '@emotion/core';

import { ellipsisStyle } from '../styles';

export type EllipsisPropType = {
  key: string;
};

export default function renderEllipsis({
  key,
}: EllipsisPropType): ReactElement {
  return (
    <span key={key} css={ellipsisStyle}>
      ...
    </span>
  );
}
