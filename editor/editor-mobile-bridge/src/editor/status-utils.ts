import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { StatusType } from '@atlaskit/editor-plugin-status';
import {
  lightModeStatusColorPalette,
  darkModeStatusColorPalette,
} from '@atlaskit/editor-common/ui-color';
import { statusMessages } from '@atlaskit/editor-core/src/messages';
import messages from '@atlaskit/editor-common/messages';
import type WebBridgeImpl from './native-to-web';

import type {
  Command,
  CommandDispatch,
  FloatingToolbarConfig,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type EditorConfiguration from './editor-configuration';
import type { ThemeModes } from '@atlaskit/theme/types';
import type { IntlShape } from 'react-intl-next';

const getColorOptionsForMode = (themeMode: ThemeModes) => {
  return themeMode === 'light'
    ? lightModeStatusColorPalette
    : darkModeStatusColorPalette;
};

const changeColor =
  (status: StatusType, color: PaletteColor, bridge: WebBridgeImpl): Command =>
  (state, dispatch) => {
    const newStatus = {
      ...status,
      color: color.label,
    } as StatusType;
    bridge.updateStatus(newStatus);
    return true;
  };

const getDefaultColorValueForMode = (
  status: StatusType,
  themeMode: ThemeModes,
): PaletteColor | undefined => {
  const colorOptions = getColorOptionsForMode(themeMode);

  const defaultColor = colorOptions.find(
    (item) => item.label === status?.color,
  );
  return defaultColor ? defaultColor : undefined;
};

const onStatusTextChange =
  (
    status: StatusType,
    newStatusText: string,
    showStatusPickerAt: number,
    bridge: WebBridgeImpl,
  ): Command =>
  (state, dispatch) => {
    if (newStatusText === '') {
      return bridge.removeStatus(showStatusPickerAt) ?? false;
    }

    const newStatus = {
      ...status,
      text: newStatusText,
    } as StatusType;
    bridge.updateStatus(newStatus);

    return true;
  };

const onBlur =
  (value: string): Command =>
  (state, dispatch) => {
    return true;
  };

export const createInputToolbar = (
  status: StatusType,
  nodeType: NodeType,
  showStatusPickerAt: number,
  intl: IntlShape,
  bridge: WebBridgeImpl,
): FloatingToolbarConfig => {
  return {
    title: 'Status',
    nodeType,
    items: [
      {
        id: 'editor.status.editText',
        type: 'input',
        placeholder: intl.formatMessage(statusMessages.placeholder),
        title: intl.formatMessage(statusMessages.editText),
        defaultValue: status.text,
        onSubmit: (newStatusText) =>
          onStatusTextChange(status, newStatusText, showStatusPickerAt, bridge),
        onBlur: (value) => onBlur(value),
      },
    ],
  };
};

export const createFloatingToolbarConfigForStatus = (
  status: StatusType,
  nodeType: NodeType,
  showStatusPickerAt: number,
  refresh: (floatingToolbarConfig: FloatingToolbarConfig) => void,
  editorConfig: EditorConfiguration,
  intl: IntlShape,
  bridge: WebBridgeImpl,
): FloatingToolbarConfig => {
  const themeMode = editorConfig.getMode();
  if (status.text === '') {
    return {
      title: 'Status',
      nodeType,
      items: [
        {
          id: 'editor.status.editText',
          type: 'input',
          placeholder: intl.formatMessage(statusMessages.placeholder),
          title: intl.formatMessage(statusMessages.editText),
          defaultValue: status.text,
          onSubmit: (newStatusText) =>
            onStatusTextChange(
              status,
              newStatusText,
              showStatusPickerAt,
              bridge,
            ),
          onBlur: (value) => onBlur(value),
        },
      ],
    };
  } else {
    return {
      title: 'Status',
      nodeType,
      items: [
        {
          id: 'editor.status.editText',
          type: 'button',
          title: intl.formatMessage(statusMessages.editText),
          showTitle: true,
          onClick: (state: EditorState, dispatch?: CommandDispatch) => {
            const newInput = createInputToolbar(
              status,
              nodeType,
              showStatusPickerAt,
              intl,
              bridge,
            );

            refresh(newInput);
            return true;
          },
        },
        {
          type: 'separator',
        },
        {
          id: 'editor.status.colorPicker',
          type: 'select',
          selectType: 'color',
          title: intl.formatMessage(statusMessages.editColor),
          defaultValue: getDefaultColorValueForMode(status, themeMode),
          options: getColorOptionsForMode(themeMode),
          onChange: (selected: PaletteColor) =>
            changeColor(status, selected, bridge),
        },
        {
          type: 'separator',
        },
        {
          id: 'editor.status.delete',
          type: 'button',
          title: intl.formatMessage(messages.remove),
          icon: RemoveIcon,
          onClick: (state: EditorState, dispatch?: CommandDispatch) => {
            return bridge.removeStatus(showStatusPickerAt) ?? false;
          },
        },
      ],
    };
  }
};
