import React from 'react';
import { orderedListSelector } from '@atlaskit/adf-schema';
import { Node } from 'prosemirror-model';
import { getListIndentLevel } from '../utils/lists';

export default function OrderedList(
  props: { start?: number; path?: Node[] } & React.Props<any>,
) {
  return (
    <ol
      className={orderedListSelector.substr(1)}
      data-indent-level={props.path ? getListIndentLevel(props.path) : 1}
      start={props.start}
    >
      {props.children}
    </ol>
  );
}
