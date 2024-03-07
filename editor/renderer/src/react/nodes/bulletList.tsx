import React from 'react';
import { bulletListSelector } from '@atlaskit/adf-schema';
import { getListIndentLevel } from '../utils/lists';
import type { Node } from '@atlaskit/editor-prosemirror/model';

export default function BulletList(
  props: React.PropsWithChildren<{ path?: Node[] }>,
) {
  return (
    <ul
      className={bulletListSelector.substr(1)}
      data-indent-level={props.path ? getListIndentLevel(props.path) : 1}
    >
      {props.children}
    </ul>
  );
}
