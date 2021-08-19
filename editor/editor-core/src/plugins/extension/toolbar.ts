import { defineMessages, InjectedIntl } from 'react-intl';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { EditorState } from 'prosemirror-state';
import { Node as PMNode } from 'prosemirror-model';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';

import { Command } from '../../types';
import commonMessages from '../../messages';
import { MacroState } from '../macro';
import {
  FloatingToolbarConfig,
  FloatingToolbarHandler,
  FloatingToolbarItem,
} from '../floating-toolbar/types';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { editExtension } from './actions';
import { getPluginState } from './pm-plugins/main';
import { ExtensionState } from './types';
import { getSelectedExtension } from './utils';
import { updateExtensionLayout, removeExtension } from './commands';
import { pluginKey as macroPluginKey } from '../macro/plugin-key';

export const messages = defineMessages({
  edit: {
    id: 'fabric.editor.edit',
    defaultMessage: 'Edit',
    description: 'Edit the properties for this extension.',
  },
});

const isLayoutSupported = (
  state: EditorState,
  selectedExtNode: { pos: number; node: PMNode },
) => {
  const {
    schema: {
      nodes: { bodiedExtension, extension, layoutSection, table, expand },
    },
    selection,
  } = state;

  if (!selectedExtNode) {
    return false;
  }

  return !!(
    (selectedExtNode.node.type === bodiedExtension ||
      (selectedExtNode.node.type === extension &&
        !hasParentNodeOfType([bodiedExtension, table, expand].filter(Boolean))(
          selection,
        ))) &&
    !hasParentNodeOfType([layoutSection])(selection)
  );
};

const breakoutOptions = (
  state: EditorState,
  formatMessage: InjectedIntl['formatMessage'],
  extensionState: ExtensionState,
  breakoutEnabled: boolean,
): Array<FloatingToolbarItem<Command>> => {
  const nodeWithPos = getSelectedExtension(state, true);
  const { layout } = extensionState;
  return nodeWithPos && breakoutEnabled && isLayoutSupported(state, nodeWithPos)
    ? [
        {
          type: 'button',
          icon: CenterIcon,
          onClick: updateExtensionLayout('default'),
          selected: layout === 'default',
          title: formatMessage(commonMessages.layoutFixedWidth),
        },
        {
          type: 'button',
          icon: WideIcon,
          onClick: updateExtensionLayout('wide'),
          selected: layout === 'wide',
          title: formatMessage(commonMessages.layoutWide),
        },
        {
          type: 'button',
          icon: FullWidthIcon,
          onClick: updateExtensionLayout('full-width'),
          selected: layout === 'full-width',
          title: formatMessage(commonMessages.layoutFullWidth),
        },
      ]
    : [];
};

const editButton = (
  formatMessage: InjectedIntl['formatMessage'],
  extensionState: ExtensionState,
): Array<FloatingToolbarItem<Command>> => {
  if (!extensionState.showEditButton) {
    return [];
  }

  return [
    {
      id: 'editor.extension.edit',
      type: 'button',
      icon: EditIcon,
      testId: 'extension-toolbar-edit-button',
      // Taking the latest `updateExtension` from plugin state to avoid race condition @see ED-8501
      onClick: (state, dispatch, view) => {
        const macroState: MacroState = macroPluginKey.getState(state);
        const { updateExtension } = getPluginState(state);

        editExtension(macroState && macroState.macroProvider, updateExtension)(
          state,
          dispatch,
          view,
        );

        return true;
      },
      title: formatMessage(messages.edit),
    },
  ];
};

export const getToolbarConfig = (
  breakoutEnabled: boolean = true,
): FloatingToolbarHandler => (state, intl) => {
  const { formatMessage } = intl;
  const extensionState = getPluginState(state);

  if (
    extensionState &&
    !extensionState.showContextPanel &&
    extensionState.element
  ) {
    const nodeType = [
      state.schema.nodes.extension,
      state.schema.nodes.inlineExtension,
      state.schema.nodes.bodiedExtension,
    ];

    const editButtonArray = editButton(formatMessage, extensionState);
    const breakoutButtonArray = breakoutOptions(
      state,
      formatMessage,
      extensionState,
      breakoutEnabled,
    );

    return {
      title: 'Extension floating controls',
      getDomRef: () => extensionState.element!.parentElement || undefined,
      nodeType,
      items: [
        ...editButtonArray,
        ...breakoutButtonArray,
        {
          type: 'separator',
          hidden:
            editButtonArray.length === 0 && breakoutButtonArray.length === 0,
        },
        {
          type: 'extensions-placeholder',
          separator: 'end',
        },
        {
          id: 'editor.extension.delete',
          type: 'button',
          icon: RemoveIcon,
          appearance: 'danger',
          onClick: removeExtension(),
          onMouseEnter: hoverDecoration(nodeType, true),
          onMouseLeave: hoverDecoration(nodeType, false),
          onFocus: hoverDecoration(nodeType, true),
          onBlur: hoverDecoration(nodeType, false),
          title: formatMessage(commonMessages.remove),
        },
      ],
    } as FloatingToolbarConfig;
  }
  return;
};
