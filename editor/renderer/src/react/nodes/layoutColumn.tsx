/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';

import {
  WidthProvider,
  clearNextSiblingMarginTopStyle,
} from '@atlaskit/editor-common/ui';

export default function LayoutSection(
  props: { width?: number } & React.Props<any>,
) {
  return (
    <div
      data-layout-column
      data-column-width={props.width}
      style={{ flexBasis: `${props.width}%` }}
    >
      <WidthProvider>
        <div css={clearNextSiblingMarginTopStyle} />
        {props.children}
      </WidthProvider>
    </div>
  );
}
