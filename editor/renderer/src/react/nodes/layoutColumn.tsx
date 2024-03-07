/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';

import {
  WidthProvider,
  clearNextSiblingMarginTopStyle,
  clearNextSiblingBlockMarkMarginTopStyle,
} from '@atlaskit/editor-common/ui';

const layoutColumnClearMarginTopStyles = css`
  ${clearNextSiblingMarginTopStyle}
  ${clearNextSiblingBlockMarkMarginTopStyle}
`;

export default function LayoutSection(
  props: React.PropsWithChildren<{ width?: number }>,
) {
  return (
    <div
      data-layout-column
      data-column-width={props.width}
      style={{ flexBasis: `${props.width}%` }}
    >
      <WidthProvider>
        <div css={layoutColumnClearMarginTopStyles} />
        {props.children}
      </WidthProvider>
    </div>
  );
}
