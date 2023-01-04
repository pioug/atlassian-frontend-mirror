import React from 'react';
import { Node } from 'prosemirror-model';
import { orderedListSelector } from '@atlaskit/adf-schema';
import { getOrderedListInlineStyles } from '@atlaskit/editor-common/styles';

import {
  getItemCounterDigitsSize,
  resolveOrder,
} from '@atlaskit/editor-common/utils';
import { getListIndentLevel } from '../utils/lists';
import { useFeatureFlags } from '../../use-feature-flags';

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
  const featureFlags = useFeatureFlags();
  let extraProps: ExtraProps = {};

  if (featureFlags?.restartNumberedLists) {
    const itemCounterDigitsSize = getItemCounterDigitsSize({
      order: props.order,
      itemsCount: props?.content?.length,
    });
    if (itemCounterDigitsSize) {
      extraProps.style = getOrderedListInlineStyles(
        itemCounterDigitsSize,
        'object',
      );
    }
    if (props.order !== undefined) {
      extraProps.start = resolveOrder(props.order);
    }
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
