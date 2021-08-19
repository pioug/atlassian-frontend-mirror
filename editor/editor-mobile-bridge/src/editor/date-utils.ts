import { Node as PMNode } from 'prosemirror-model';
import { InjectedIntl } from 'react-intl';
import {
  Command,
  dateMessages,
  dateToDateType,
  deleteDate,
  FloatingToolbarConfig,
  INPUT_METHOD,
  insertDate,
  messages,
} from '@atlaskit/editor-core';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

export const createFloatingToolbarConfigForDate = (
  node: PMNode,
  intl: InjectedIntl,
): FloatingToolbarConfig => ({
  title: 'Date',
  nodeType: node.type,
  items: [
    {
      id: 'editor.date.datePicker',
      type: 'select',
      selectType: 'date',
      options: [],
      title: intl.formatMessage(dateMessages.editText),
      defaultValue: node.attrs.timestamp,
      onChange: (timestamp: number): Command => (state, dispatch) => {
        const dateType = dateToDateType(new Date(timestamp));
        if (dispatch) {
          return insertDate(
            dateType,
            INPUT_METHOD.TOOLBAR,
            INPUT_METHOD.PICKER,
            false,
          )(state, dispatch);
        }

        return true;
      },
    },
    {
      type: 'separator',
    },
    {
      id: 'editor.date.delete',
      type: 'button',
      title: intl.formatMessage(messages.remove),
      icon: RemoveIcon,
      onClick: (state, dispatch) => {
        return deleteDate()(state, dispatch);
      },
    },
  ],
});
