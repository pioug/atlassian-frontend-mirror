import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  timestampToString,
  timestampToTaskContext,
  isPastDate,
  DateSharedCssClassName,
} from '@atlaskit/editor-common';
import { Date } from '@atlaskit/date';
import { setDatePickerAt } from '../actions';
import { getPosHandler } from '../../../nodeviews';

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
  getPos?: getPosHandler;
}

class DateNodeView extends React.Component<Props & InjectedIntlProps> {
  render() {
    const {
      node: {
        attrs: { timestamp },
      },
      view: {
        state: { doc, schema, selection },
      },
      intl,
      getPos,
    } = this.props;

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
      <span
        className={DateSharedCssClassName.DATE_WRAPPER}
        onClick={this.handleClick}
      >
        <Date color={color} value={timestamp}>
          {withinIncompleteTask
            ? timestampToTaskContext(timestamp, intl)
            : timestampToString(timestamp, intl)}
        </Date>
      </span>
    );
  }

  private handleClick = (event: React.SyntheticEvent<any>) => {
    event.nativeEvent.stopImmediatePropagation();
    const { state, dispatch } = this.props.view;
    setDatePickerAt(state.selection.from)(state, dispatch);
  };
}

export default injectIntl(DateNodeView);
