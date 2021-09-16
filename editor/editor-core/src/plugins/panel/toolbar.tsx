import {
  FloatingToolbarColorPicker,
  FloatingToolbarConfig,
  FloatingToolbarEmojiPicker,
  FloatingToolbarItem,
  FloatingToolbarButton,
} from './../floating-toolbar/types';
import { PanelPluginOptions } from './types';
import { defineMessages, InjectedIntl } from 'react-intl';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import RemoveEmojiIcon from '../floating-toolbar/ui/EditorRemoveEmojiIcon';

import commonMessages from '../../messages';
import { removePanel, changePanelType } from './actions';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

import { Command } from '../../types';
import { panelBackgroundPalette } from '../../ui/ColorPalette/Palettes/panelBackgroundPalette';
import {
  ProviderFactory,
  getPanelTypeBackground,
} from '@atlaskit/editor-common';
import { FormattedMessage } from 'react-intl';
import { findPanel } from './utils';
import { EditorView } from 'prosemirror-view';
import { findDomRefAtPos } from 'prosemirror-utils';
import {
  DEFAULT_BORDER_COLOR,
  PaletteColor,
} from '../../ui/ColorPalette/Palettes';
import { PanelType } from '@atlaskit/adf-schema';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  AnalyticsEventPayload,
  withAnalytics,
} from '../analytics';

export const messages = defineMessages({
  info: {
    id: 'fabric.editor.info',
    defaultMessage: 'Info',
    description:
      'Panels provide a way to highlight text. The info panel has a blue background.',
  },
  note: {
    id: 'fabric.editor.note',
    defaultMessage: 'Note',
    description:
      'Panels provide a way to highlight text. The note panel has a purple background.',
  },
  success: {
    id: 'fabric.editor.success',
    defaultMessage: 'Success',
    description:
      'Panels provide a way to highlight text. The success panel has a green background.',
  },
  warning: {
    id: 'fabric.editor.warning',
    defaultMessage: 'Warning',
    description:
      'Panels provide a way to highlight text. The warning panel has a yellow background.',
  },
  error: {
    id: 'fabric.editor.error',
    defaultMessage: 'Error',
    description:
      'Panels provide a way to highlight text. The error panel has a red background.',
  },
  emoji: {
    id: 'fabric.editor.panel.emoji',
    defaultMessage: 'Add emoji',
    description: 'Select the panel icon',
  },
  backgroundColor: {
    id: 'fabric.editor.panel.backgroundColor',
    defaultMessage: 'Background color',
    description: 'Select the panel background color.',
  },
});

export const getToolbarItems = (
  formatMessage: (
    messageDescriptor: FormattedMessage.MessageDescriptor,
  ) => string,
  panelNodeType: NodeType,
  isCustomPanelEnabled: boolean,
  providerFactory: ProviderFactory,
  activePanelType?: string,
  activePanelColor?: string,
  activePanelIcon?: string,
): FloatingToolbarItem<Command>[] => {
  const items: FloatingToolbarItem<Command>[] = [
    {
      id: 'editor.panel.info',
      type: 'button',
      icon: InfoIcon,
      onClick: changePanelType(PanelType.INFO),
      selected: activePanelType === PanelType.INFO,
      title: formatMessage(messages.info),
    },
    {
      id: 'editor.panel.note',
      type: 'button',
      icon: NoteIcon,
      onClick: changePanelType(PanelType.NOTE),
      selected: activePanelType === PanelType.NOTE,
      title: formatMessage(messages.note),
    },
    {
      id: 'editor.panel.success',
      type: 'button',
      icon: SuccessIcon,
      onClick: changePanelType(PanelType.SUCCESS),
      selected: activePanelType === PanelType.SUCCESS,
      title: formatMessage(messages.success),
    },
    {
      id: 'editor.panel.warning',
      type: 'button',
      icon: WarningIcon,
      onClick: changePanelType(PanelType.WARNING),
      selected: activePanelType === PanelType.WARNING,
      title: formatMessage(messages.warning),
    },
    {
      id: 'editor.panel.error',
      type: 'button',
      icon: ErrorIcon,
      onClick: changePanelType(PanelType.ERROR),
      selected: activePanelType === PanelType.ERROR,
      title: formatMessage(messages.error),
    },
  ];

  if (isCustomPanelEnabled) {
    const changeColor = (color: string): Command => (state, dispatch) => {
      const panelNode = findPanel(state);
      if (panelNode === undefined) {
        return false;
      }
      let previousColor =
        panelNode.node.attrs.panelColor ||
        getPanelTypeBackground(panelNode.node.attrs.panelType);
      if (previousColor === color) {
        changePanelType(
          PanelType.CUSTOM,
          { color },
          isCustomPanelEnabled,
        )(state, dispatch);
        return false;
      }
      const payload: AnalyticsEventPayload = {
        action: ACTION.CHANGED_BACKGROUND_COLOR,
        actionSubject: ACTION_SUBJECT.PANEL,
        actionSubjectId: ACTION_SUBJECT_ID.PANEL,
        attributes: { newColor: color, previousColor: previousColor },
        eventType: EVENT_TYPE.TRACK,
      };
      withAnalytics(payload)(
        changePanelType(PanelType.CUSTOM, { color }, isCustomPanelEnabled),
      )(state, dispatch);
      return false;
    };

    const changeEmoji = (emoji: string): Command => (state, dispatch) => {
      const panelNode = findPanel(state);
      if (panelNode === undefined) {
        return false;
      }
      let previousIcon = panelNode.node.attrs.panelIcon || '';
      if (previousIcon === emoji) {
        changePanelType(PanelType.CUSTOM, { emoji }, true)(state, dispatch);
        return false;
      }
      const payload: AnalyticsEventPayload = {
        action: ACTION.CHANGED_ICON,
        actionSubject: ACTION_SUBJECT.PANEL,
        actionSubjectId: ACTION_SUBJECT_ID.PANEL,
        attributes: { newIcon: emoji, previousIcon: previousIcon },
        eventType: EVENT_TYPE.TRACK,
      };
      withAnalytics(payload)(
        changePanelType(PanelType.CUSTOM, { emoji }, true),
      )(state, dispatch);
      return false;
    };

    const removeEmoji = (): Command => (state, dispatch) => {
      const panelNode = findPanel(state);
      if (activePanelType === PanelType.CUSTOM && !activePanelIcon) {
        return false;
      }
      if (panelNode === undefined) {
        return false;
      }
      const payload: AnalyticsEventPayload = {
        action: ACTION.REMOVE_ICON,
        actionSubject: ACTION_SUBJECT.PANEL,
        actionSubjectId: ACTION_SUBJECT_ID.PANEL,
        attributes: { icon: panelNode.node.attrs.panelIcon },
        eventType: EVENT_TYPE.TRACK,
      };
      withAnalytics(payload)(
        changePanelType(
          PanelType.CUSTOM,
          { emoji: undefined },
          isCustomPanelEnabled,
        ),
      )(state, dispatch);
      return false;
    };

    const panelColor =
      activePanelType === PanelType.CUSTOM
        ? activePanelColor || getPanelTypeBackground(PanelType.INFO)
        : getPanelTypeBackground(
            activePanelType as Exclude<PanelType, PanelType.CUSTOM>,
          );

    const defaultPalette =
      panelBackgroundPalette.find((item) => item.value === panelColor) ||
      ({
        label: 'Custom',
        value: panelColor,
        border: DEFAULT_BORDER_COLOR,
      } as PaletteColor);

    const colorPicker: FloatingToolbarColorPicker<Command> = {
      id: 'editor.panel.colorPicker',
      title: formatMessage(messages.backgroundColor),
      type: 'select',
      selectType: 'color',
      defaultValue: defaultPalette,
      options: panelBackgroundPalette,
      onChange: (option) => changeColor(option.value),
    };

    const emojiPicker: FloatingToolbarEmojiPicker<Command> = {
      id: 'editor.panel.emojiPicker',
      title: formatMessage(messages.emoji),
      type: 'select',
      selectType: 'emoji',
      options: [],
      selected: activePanelType === PanelType.CUSTOM && !!activePanelIcon,
      onChange: (emojiShortName) => changeEmoji(emojiShortName),
    };

    const removeEmojiButton: FloatingToolbarButton<Command> = {
      id: 'editor.panel.removeEmoji',
      type: 'button',
      icon: RemoveEmojiIcon,
      onClick: removeEmoji(),
      title: formatMessage(commonMessages.removeEmoji),
      disabled: activePanelIcon ? false : true,
    };

    items.push(
      emojiPicker,
      removeEmojiButton,
      {
        type: 'separator',
      },
      colorPicker,
    );
  }

  items.push(
    {
      type: 'separator',
    },
    {
      id: 'editor.panel.delete',
      type: 'button',
      appearance: 'danger',
      icon: RemoveIcon,
      onClick: removePanel(),
      onMouseEnter: hoverDecoration(panelNodeType, true),
      onMouseLeave: hoverDecoration(panelNodeType, false),
      onFocus: hoverDecoration(panelNodeType, true),
      onBlur: hoverDecoration(panelNodeType, false),
      title: formatMessage(commonMessages.remove),
    },
  );

  return items;
};

export const getToolbarConfig = (
  state: EditorState,
  intl: InjectedIntl,
  options: PanelPluginOptions = {},
  providerFactory: ProviderFactory,
): FloatingToolbarConfig | undefined => {
  const { formatMessage } = intl;
  const panelObject = findPanel(state);
  if (panelObject) {
    const nodeType = state.schema.nodes.panel;
    const { panelType, panelColor, panelIcon } = panelObject.node.attrs;

    // force toolbar to be turned on
    const items = getToolbarItems(
      formatMessage,
      nodeType,
      options.UNSAFE_allowCustomPanel || false,
      providerFactory,
      panelType,
      options.UNSAFE_allowCustomPanel ? panelColor : undefined,
      options.UNSAFE_allowCustomPanel ? panelIcon : undefined,
    );

    const getDomRef = (editorView: EditorView) => {
      const domAtPos = editorView.domAtPos.bind(editorView);
      const element = findDomRefAtPos(
        panelObject.pos,
        domAtPos,
      ) as HTMLDivElement;
      return element;
    };

    return {
      title: 'Panel floating controls',
      getDomRef,
      nodeType,
      items,
    };
  }
  return;
};
