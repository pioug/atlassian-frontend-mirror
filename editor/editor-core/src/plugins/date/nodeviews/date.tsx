import React from 'react';
import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import { useIntl } from 'react-intl-next';
import {
  timestampToString,
  timestampToTaskContext,
  isPastDate,
} from '@atlaskit/editor-common/utils';
import { Date } from '@atlaskit/date';
import { setDatePickerAt } from '../actions';
import { InlineNodeViewComponentProps } from '../../../nodeviews/getInlineNodeViewProducer';

export function DateNodeView(props: InlineNodeViewComponentProps) {
  const {
    node: {
      attrs: { timestamp },
    },
    view: {
      state: { doc, schema, selection },
    },
    getPos,
  } = props;
  const intl = useIntl();

  // We fall back to selection.$from even though it does not cover all use cases
  // eg. upon Editor init, selection is at the start, not at the Date node
  const $nodePos =
    typeof getPos === 'function' ? doc.resolve(getPos()) : selection.$from;

  const parent = $nodePos.parent;
  const withinIncompleteTask =
    parent.type === schema.nodes.taskItem && parent.attrs.state !== 'DONE';
  const color =
    withinIncompleteTask && isPastDate(timestamp) ? 'red' : undefined;

  return (
    <span className={DateSharedCssClassName.DATE_WRAPPER} onClick={handleClick}>
      <Date color={color} value={timestamp}>
        {withinIncompleteTask
          ? timestampToTaskContext(timestamp, intl)
          : timestampToString(timestamp, intl)}
      </Date>
    </span>
  );

  function handleClick(event: React.SyntheticEvent<any>) {
    event.nativeEvent.stopImmediatePropagation();
    const { state, dispatch } = props.view;
    setDatePickerAt(state.selection.from)(state, dispatch);
  }
}
