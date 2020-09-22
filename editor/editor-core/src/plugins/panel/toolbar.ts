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

import { Command } from '../../types';

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
  custom: {
    id: 'fabric.editor.custom',
    defaultMessage: 'Custom',
    description:
      'Panels provide a way to highlight text. The custom panel allows to set custom icon and background color.',
  },
});

export const getToolbarConfig = (
  state: EditorState,
  intl: InjectedIntl,
  options: PanelPluginOptions = {},
): FloatingToolbarConfig | undefined => {
  const { formatMessage } = intl;
  const panelState = getPluginState(state);
  if (panelState && panelState.toolbarVisible && panelState.element) {
    const { activePanelType } = panelState;
    const nodeType = state.schema.nodes.panel;

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
      {
        type: 'separator',
      },
      {
        type: 'button',
        appearance: 'danger',
        icon: RemoveIcon,
        onClick: removePanel(),
        onMouseEnter: hoverDecoration(nodeType, true),
        onMouseLeave: hoverDecoration(nodeType, false),
        title: formatMessage(commonMessages.remove),
      },
    ];

    return {
      title: 'Panel floating controls',
      getDomRef: () => panelState.element,
      nodeType,
      items,
    };
  }
  return;
};
