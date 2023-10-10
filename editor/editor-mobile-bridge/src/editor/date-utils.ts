import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { IntlShape } from 'react-intl-next';
import messages from '@atlaskit/editor-common/messages';
import { dateMessages } from '@atlaskit/editor-core/src/messages';
import type {
  FloatingToolbarConfig,
  Command,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import type { mobileApiPlugin } from './plugins/mobileApiPlugin';

export const createFloatingToolbarConfigForDate = (
  node: PMNode,
  intl: IntlShape,
  api: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined = undefined,
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
            api?.date?.actions?.insertDate(
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
        api?.date?.actions?.deleteDate()(state, dispatch);
        return true;
      },
    },
  ],
});
