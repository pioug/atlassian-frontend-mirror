import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import {
  FloatingToolbarConfig,
  updateStatusWithAnalytics,
  Command,
  CommandDispatch,
  INPUT_METHOD,
  PaletteColor,
  StatusType,
  lightModeStatusColorPalette,
  darkModeStatusColorPalette,
  messages,
  statusMessages,
  removeStatus,
} from '@atlaskit/editor-core';
import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import EditorConfiguration from './editor-configuration';
import { ThemeModes } from '@atlaskit/theme/types';
import { InjectedIntl } from 'react-intl';

const getColorOptionsForMode = (themeMode: ThemeModes) => {
  return themeMode === 'light'
    ? lightModeStatusColorPalette
    : darkModeStatusColorPalette;
};

const changeColor = (status: StatusType, color: PaletteColor): Command => (
  state,
  dispatch,
) => {
  const newStatus = {
    ...status,
    color: color.label,
  } as StatusType;
  updateStatusWithAnalytics(INPUT_METHOD.TOOLBAR, newStatus)(state, dispatch);
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

const onStatusTextChange = (
  status: StatusType,
  newStatusText: string,
  showStatusPickerAt: number,
): Command => (state, dispatch) => {
  if (newStatusText === '') {
    return removeStatus(showStatusPickerAt)(state, dispatch);
  }

  const newStatus = {
    ...status,
    text: newStatusText,
  } as StatusType;
  updateStatusWithAnalytics(INPUT_METHOD.TOOLBAR, newStatus)(state, dispatch);
  return true;
};

const onBlur = (value: string): Command => (state, dispatch) => {
  return true;
};

export const createInputToolbar = (
  status: StatusType,
  nodeType: NodeType,
  showStatusPickerAt: number,
  intl: InjectedIntl,
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
          onStatusTextChange(status, newStatusText, showStatusPickerAt),
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
  intl: InjectedIntl,
): FloatingToolbarConfig => {
  const themeMode = editorConfig.getMode();

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
        onChange: (selected: PaletteColor) => changeColor(status, selected),
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
          return removeStatus(showStatusPickerAt)(state, dispatch);
        },
      },
    ],
  };
};
