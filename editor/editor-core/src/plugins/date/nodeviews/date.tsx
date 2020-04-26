import React from 'react';
import styled from 'styled-components';
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
import { akEditorSelectedBorderStyles } from '@atlaskit/editor-common';

const SelectableDate = styled(Date)`
  .dateView-content-wrap.ProseMirror-selectednode & {
    ${akEditorSelectedBorderStyles};
  }
  cursor: pointer;
`;

const Span = styled.span`
  line-height: initial;
`;

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

class DateNodeView extends React.Component<Props & InjectedIntlProps> {
  render() {
    const {
      node: {
        attrs: { timestamp },
      },
      view: {
        state: { schema, selection },
      },
      intl,
    } = this.props;

    const parent = selection.$from.parent;
    const withinIncompleteTask =
      parent.type === schema.nodes.taskItem && parent.attrs.state !== 'DONE';

    const color =
      withinIncompleteTask && isPastDate(timestamp) ? 'red' : undefined;

    return (
      <Span
        className={DateSharedCssClassName.DATE_WRAPPER}
        onClick={this.handleClick}
      >
        <SelectableDate color={color} value={timestamp}>
          {withinIncompleteTask
            ? timestampToTaskContext(timestamp, intl)
            : timestampToString(timestamp, intl)}
        </SelectableDate>
      </Span>
    );
  }

  private handleClick = (event: React.SyntheticEvent<any>) => {
    event.nativeEvent.stopImmediatePropagation();
    const { state, dispatch } = this.props.view;
    setDatePickerAt(state.selection.from)(state, dispatch);
  };
}

export default injectIntl(DateNodeView);
