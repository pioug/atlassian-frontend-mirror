import React from 'react';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { orderedListSelector } from '@atlaskit/adf-schema';
import { getOrderedListInlineStyles } from '@atlaskit/editor-common/styles';

import {
  getItemCounterDigitsSize,
  resolveOrder,
} from '@atlaskit/editor-common/utils';
import { getListIndentLevel } from '../utils/lists';

type ExtraProps = {
  'data-item-counter-digits'?: number;
  start?: number;
  style?: Record<string, any>;
};

export default function OrderedList(props: {
  order?: number;
  start?: number;
  path?: Node[];
  content?: Node[];
  children: React.ReactNode;
}) {
  let extraProps: ExtraProps = {};

  const itemCounterDigitsSize = getItemCounterDigitsSize({
    order: props.order,
    itemsCount: props?.content?.length,
  });
  if (itemCounterDigitsSize && itemCounterDigitsSize > 2) {
    extraProps.style = getOrderedListInlineStyles(
      itemCounterDigitsSize,
      'object',
    );
  }
  if (props.order !== undefined) {
    extraProps.start = resolveOrder(props.order);
  }

  return (
    <ol
      className={orderedListSelector.substr(1)}
      data-indent-level={props.path ? getListIndentLevel(props.path) : 1}
      start={props.start}
      {...extraProps}
    >
      {props.children}
    </ol>
  );
}
