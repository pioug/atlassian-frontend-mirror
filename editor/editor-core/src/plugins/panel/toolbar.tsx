import {
  FloatingToolbarColorPicker,
  FloatingToolbarConfig,
  FloatingToolbarEmojiPicker,
  FloatingToolbarItem,
  FloatingToolbarButton,
} from './../floating-toolbar/types';
import { EmojiInfo, PanelPluginOptions } from './types';
import { IntlShape } from 'react-intl-next';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import RemoveEmojiIcon from '@atlaskit/icon/glyph/editor/remove-emoji';

import commonMessages from '../../messages';
import { removePanel, changePanelType } from './actions';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

import { Command } from '../../types';
import { panelBackgroundPalette } from '../../ui/ColorPalette/Palettes/panelBackgroundPalette';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { getPanelTypeBackground } from '@atlaskit/editor-common/panel';
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
import { messages } from './message';
import { EmojiId } from '@atlaskit/emoji/types';

export const panelIconMap: {
  [key in Exclude<PanelType, PanelType.CUSTOM>]: EmojiInfo;
} = {
  [PanelType.INFO]: { shortName: ':info:', id: 'atlassian-info' },
  [PanelType.NOTE]: { shortName: ':note:', id: 'atlassian-note' },
  [PanelType.WARNING]: { shortName: ':warning:', id: 'atlassian-warning' },
  [PanelType.ERROR]: { shortName: ':cross_mark:', id: 'atlassian-cross_mark' },
  [PanelType.SUCCESS]: {
    shortName: ':check_mark:',
    id: 'atlassian-check_mark',
  },
  [PanelType.TIP]: { shortName: ':tip:', id: 'atlassian-tip' },
};

export const getToolbarItems = (
  formatMessage: IntlShape['formatMessage'],
  panelNodeType: NodeType,
  isCustomPanelEnabled: boolean,
  isCustomPanelEditable: boolean,
  providerFactory: ProviderFactory,
  activePanelType?: string,
  activePanelColor?: string,
  activePanelIcon?: string,
  state?: EditorState,
): FloatingToolbarItem<Command>[] => {
  // TODO: ED-14403 investigate why these titles are not getting translated for the tooltips
  const items: FloatingToolbarItem<Command>[] = [
    {
      id: 'editor.panel.info',
      type: 'button',
      icon: InfoIcon,
      onClick: changePanelType(PanelType.INFO),
      selected: activePanelType === PanelType.INFO,
      title: formatMessage(messages.info),
      tabIndex: null,
    },
    {
      id: 'editor.panel.note',
      type: 'button',
      icon: NoteIcon,
      onClick: changePanelType(PanelType.NOTE),
      selected: activePanelType === PanelType.NOTE,
      title: formatMessage(messages.note),
      tabIndex: null,
    },
    {
      id: 'editor.panel.success',
      type: 'button',
      icon: SuccessIcon,
      onClick: changePanelType(PanelType.SUCCESS),
      selected: activePanelType === PanelType.SUCCESS,
      title: formatMessage(messages.success),
      tabIndex: null,
    },
    {
      id: 'editor.panel.warning',
      type: 'button',
      icon: WarningIcon,
      onClick: changePanelType(PanelType.WARNING),
      selected: activePanelType === PanelType.WARNING,
      title: formatMessage(messages.warning),
      tabIndex: null,
    },
    {
      id: 'editor.panel.error',
      type: 'button',
      icon: ErrorIcon,
      onClick: changePanelType(PanelType.ERROR),
      selected: activePanelType === PanelType.ERROR,
      title: formatMessage(messages.error),
      tabIndex: null,
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

      const emojiInfo = panelNode.node.attrs.panelType as Exclude<
        PanelType,
        PanelType.CUSTOM
      >;
      const panelEmoji = panelIconMap[emojiInfo];
      const previousEmoji = panelEmoji
        ? { emoji: panelEmoji.shortName, emojiId: panelEmoji.id }
        : {};
      if (previousColor === color) {
        changePanelType(
          PanelType.CUSTOM,
          { color, ...previousEmoji },
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
        changePanelType(
          PanelType.CUSTOM,
          { color, ...previousEmoji },
          isCustomPanelEnabled,
        ),
      )(state, dispatch);
      return false;
    };

    const changeEmoji = (emoji: EmojiId): Command => (state, dispatch) => {
      const panelNode = findPanel(state);
      if (panelNode === undefined) {
        return false;
      }
      let previousIcon = panelNode.node.attrs.panelIcon || '';
      if (previousIcon === emoji.shortName) {
        changePanelType(
          PanelType.CUSTOM,
          {
            emoji: emoji.shortName,
            emojiId: emoji.id,
            emojiText: emoji.fallback,
          },
          true,
        )(state, dispatch);
        return false;
      }
      const payload: AnalyticsEventPayload = {
        action: ACTION.CHANGED_ICON,
        actionSubject: ACTION_SUBJECT.PANEL,
        actionSubjectId: ACTION_SUBJECT_ID.PANEL,
        attributes: { newIcon: emoji.shortName, previousIcon: previousIcon },
        eventType: EVENT_TYPE.TRACK,
      };
      withAnalytics(payload)(
        changePanelType(
          PanelType.CUSTOM,
          {
            emoji: emoji.shortName,
            emojiId: emoji.id,
            emojiText: emoji.fallback,
          },
          true,
        ),
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
          { emoji: undefined, emojiId: undefined, emojiText: undefined },
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

    if (isCustomPanelEditable) {
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
        onChange: (emoji) => changeEmoji(emoji),
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
  }

  if (state) {
    items.push({
      type: 'copy-button',
      items: [
        {
          type: 'separator',
        },
        { state, formatMessage, nodeType: panelNodeType },
      ],
    });
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
      tabIndex: null,
    },
  );

  return items;
};

export const getToolbarConfig = (
  state: EditorState,
  intl: IntlShape,
  options: PanelPluginOptions = {},
  providerFactory: ProviderFactory,
): FloatingToolbarConfig | undefined => {
  const { formatMessage } = intl;
  const panelObject = findPanel(state);
  if (panelObject) {
    const nodeType = state.schema.nodes.panel;
    const { panelType, panelColor, panelIcon } = panelObject.node.attrs;

    const isStandardPanel = (panelType: PanelType) => {
      return panelType !== PanelType.CUSTOM ? panelType : undefined;
    };

    // force toolbar to be turned on
    const items = getToolbarItems(
      formatMessage,
      nodeType,
      options.allowCustomPanel || false,
      (options.allowCustomPanel && options.allowCustomPanelEdit) || false,
      providerFactory,
      panelType,
      options.allowCustomPanel ? panelColor : undefined,
      options.allowCustomPanel
        ? panelIcon || isStandardPanel(panelType)
        : undefined,
      state,
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
      scrollable: true,
    };
  }
  return;
};
