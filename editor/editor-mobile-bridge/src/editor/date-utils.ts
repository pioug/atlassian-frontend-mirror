import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { IntlShape } from 'react-intl-next';
import {
  Command,
  dateMessages,
  deleteDate,
  FloatingToolbarConfig,
  INPUT_METHOD,
  insertDate,
  messages,
} from '@atlaskit/editor-core';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

export const createFloatingToolbarConfigForDate = (
  node: PMNode,
  intl: IntlShape,
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
      onChange:
        (timestamp: number): Command =>
        (state, dispatch) => {
          // In detail of Mobile DatePicker is documented in page:
          // https://product-fabric.atlassian.net/wiki/spaces/~hule/pages/3238889679/Date+picker+in+Hybrid+Editor+of+iOS+Android
          const date = new Date(timestamp);
          const dateType = {
            day: date.getUTCDate(),
            month: date.getUTCMonth() + 1, // Date month is 0-11, DateType is 1-12
            year: date.getUTCFullYear(),
          };
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
