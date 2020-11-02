import React from 'react';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
} from './../floating-toolbar/types';
import { PanelPluginOptions } from './types';
import { defineMessages, InjectedIntl } from 'react-intl';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import { PanelType } from '@atlaskit/adf-schema';

import commonMessages from '../../messages';
import { removePanel, changePanelType } from './actions';
import { getPluginState } from './pm-plugins/main';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

import { Command } from '../../types';
import { ColorPickerButton } from './ui/color-picker-button';
import { EmojiPickerButton } from './ui/emoji-picker-button';
import {
  ProviderFactory,
  getPanelTypeBackground,
} from '@atlaskit/editor-common';
import { FormattedMessage } from 'react-intl';
import { EmojiId } from '@atlaskit/emoji';

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
    id: 'fabric.editor.emoji',
    defaultMessage: 'Add icon',
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
      type: 'button',
      icon: InfoIcon,
      onClick: changePanelType(PanelType.INFO),
      selected: activePanelType === PanelType.INFO,
      title: formatMessage(messages.info),
    },
    {
      type: 'button',
      icon: NoteIcon,
      onClick: changePanelType(PanelType.NOTE),
      selected: activePanelType === PanelType.NOTE,
      title: formatMessage(messages.note),
    },
    {
      type: 'button',
      icon: SuccessIcon,
      onClick: changePanelType(PanelType.SUCCESS),
      selected: activePanelType === PanelType.SUCCESS,
      title: formatMessage(messages.success),
    },
    {
      type: 'button',
      icon: WarningIcon,
      onClick: changePanelType(PanelType.WARNING),
      selected: activePanelType === PanelType.WARNING,
      title: formatMessage(messages.warning),
    },
    {
      type: 'button',
      icon: ErrorIcon,
      onClick: changePanelType(PanelType.ERROR),
      selected: activePanelType === PanelType.ERROR,
      title: formatMessage(messages.error),
    },
  ];

  // Add custom panel buttons
  if (isCustomPanelEnabled) {
    items.push(
      {
        type: 'custom',
        render: (view, idx) => (
          <EmojiPickerButton
            key={idx}
            view={view}
            title={formatMessage(messages.emoji)}
            providerFactory={providerFactory}
            isSelected={
              activePanelType === PanelType.CUSTOM && !!activePanelIcon
            }
            onChange={(emoji: EmojiId) => {
              if (!view) {
                return;
              }
              changePanelType(
                PanelType.CUSTOM,
                { emoji: emoji.shortName },
                isCustomPanelEnabled,
              )(view.state, view.dispatch);
            }}
          />
        ),
      },
      {
        type: 'separator',
      },
      {
        type: 'custom',
        render: (view, idx) => {
          /*
            if the active panel type is custom, assign active panel color if available, otherwise get the 'info' panel color
            if the active panel type is not custom, get and assign the color of the current panel
          */
          const panelColor =
            activePanelType === PanelType.CUSTOM
              ? activePanelColor || getPanelTypeBackground(PanelType.INFO)
              : getPanelTypeBackground(
                  activePanelType as Exclude<PanelType, PanelType.CUSTOM>,
                );

          return (
            <ColorPickerButton
              key={idx}
              view={view}
              title={formatMessage(messages.backgroundColor)}
              currentColor={panelColor}
              onChange={(color: string) => {
                if (!view) {
                  return;
                }
                changePanelType(
                  PanelType.CUSTOM,
                  { color },
                  isCustomPanelEnabled,
                )(view.state, view.dispatch);
              }}
            />
          );
        },
      },
    );
  }

  // Add delete button
  items.push(
    {
      type: 'separator',
    },
    {
      type: 'button',
      appearance: 'danger',
      icon: RemoveIcon,
      onClick: removePanel(),
      onMouseEnter: hoverDecoration(panelNodeType, true),
      onMouseLeave: hoverDecoration(panelNodeType, false),
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
  const panelState = getPluginState(state);
  if (panelState && panelState.toolbarVisible && panelState.element) {
    const { activePanelType, activePanelColor, activePanelIcon } = panelState;
    const nodeType = state.schema.nodes.panel;

    const items = getToolbarItems(
      formatMessage,
      nodeType,
      options.UNSAFE_allowCustomPanel || false,
      providerFactory,
      activePanelType,
      activePanelColor,
      activePanelIcon,
    );

    return {
      title: 'Panel floating controls',
      getDomRef: () => panelState.element,
      nodeType,
      items,
    };
  }
  return;
};
