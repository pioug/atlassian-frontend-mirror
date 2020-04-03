import React from 'react';
import {
  WidthProvider,
  ClearNextSiblingMarginTop,
} from '@atlaskit/editor-common';

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
        <ClearNextSiblingMarginTop />
        {props.children}
      </WidthProvider>
    </div>
  );
}
