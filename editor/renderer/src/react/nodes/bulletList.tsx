import React from 'react';
import { bulletListSelector } from '@atlaskit/adf-schema';
import { getListIndentLevel } from '../utils/lists';
import { Node } from 'prosemirror-model';

export default function BulletList(
  props: { path?: Node[] } & React.Props<any>,
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
