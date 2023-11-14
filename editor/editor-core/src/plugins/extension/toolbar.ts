import type { IntlShape } from 'react-intl-next';
import { defineMessages } from 'react-intl-next';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';

import commonMessages from '@atlaskit/editor-common/messages';
import type {
  ConfirmDialogOptions,
  FloatingToolbarConfig,
  FloatingToolbarHandler,
  FloatingToolbarItem,
  Command,
} from '@atlaskit/editor-common/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { editExtension } from './actions';
import { getPluginState } from './pm-plugins/main';
import type { ExtensionState } from './types';
import { getSelectedExtension } from './utils';
import {
  updateExtensionLayout,
  removeExtension,
  removeDescendantNodes,
} from './commands';

import { pluginKey as macroPluginKey } from './pm-plugins/macro/plugin-key';
import {
  isReferencedSource,
  getChildrenInfo,
  getNodeName,
} from '@atlaskit/editor-common/utils';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';

export const messages = defineMessages({
  edit: {
    id: 'fabric.editor.edit',
    defaultMessage: 'Edit',
    description: 'Edit the properties for this extension.',
  },
  deleteElementTitle: {
    id: 'fabric.editor.extension.deleteElementTitle',
    defaultMessage: 'Delete element',
    description:
      'Title text for confirm modal when deleting an extension linked to a data consumer.',
  },
  unnamedSource: {
    id: 'fabric.editor.extension.sourceNoTitledName',
    defaultMessage: 'this element',
    description: 'The current element without preset name been selected',
  },
  confirmDeleteLinkedModalOKButton: {
    id: 'fabric.editor.extension.confirmDeleteLinkedModalOKButton',
    defaultMessage: 'Delete',
    description:
      'Action button label for confirm modal when deleting an extension linked to a data consumer.',
  },
  confirmDeleteLinkedModalMessage: {
    id: 'fabric.editor.extension.confirmDeleteLinkedModalMessage',
    defaultMessage: 'Deleting {nodeName} will break anything connected to it.',
    description:
      'Message for confirm modal when deleting a extension linked to an data consumer.',
  },
  confirmModalCheckboxLabel: {
    id: 'fabric.editor.floatingToolbar.confirmModalCheckboxLabel',
    defaultMessage: 'Also delete connected elements',
    description: 'checkbox label text',
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
  formatMessage: IntlShape['formatMessage'],
  extensionState: ExtensionState,
  breakoutEnabled: boolean,
): Array<FloatingToolbarItem<Command>> => {
  const nodeWithPos = getSelectedExtension(state, true);

  // we should only return breakout options when breakouts are enabled and the node supports them
  if (nodeWithPos && breakoutEnabled && isLayoutSupported(state, nodeWithPos)) {
    const { layout } = nodeWithPos.node.attrs;
    return [
      {
        type: 'button',
        icon: CenterIcon,
        onClick: updateExtensionLayout('default'),
        selected: layout === 'default',
        title: formatMessage(commonMessages.layoutFixedWidth),
        tabIndex: null,
      },
      {
        type: 'button',
        icon: WideIcon,
        onClick: updateExtensionLayout('wide'),
        selected: layout === 'wide',
        title: formatMessage(commonMessages.layoutWide),
        tabIndex: null,
      },
      {
        type: 'button',
        icon: FullWidthIcon,
        onClick: updateExtensionLayout('full-width'),
        selected: layout === 'full-width',
        title: formatMessage(commonMessages.layoutFullWidth),
        tabIndex: null,
      },
    ];
  }
  return [];
};

const editButton = (
  formatMessage: IntlShape['formatMessage'],
  extensionState: ExtensionState,
  applyChangeToContextPanel: ApplyChangeHandler | undefined,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
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
        const macroState = macroPluginKey.getState(state);
        const { updateExtension } = getPluginState(state);

        editExtension(
          macroState && macroState.macroProvider,
          applyChangeToContextPanel,
          editorAnalyticsAPI,
          updateExtension,
        )(state, dispatch, view);

        return true;
      },
      title: formatMessage(messages.edit),
      tabIndex: null,
      focusEditoronEnter: true,
    },
  ];
};

interface GetToolbarConfigProps {
  breakoutEnabled: boolean | undefined;
  hoverDecoration: HoverDecorationHandler | undefined;
  applyChangeToContextPanel: ApplyChangeHandler | undefined;
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
}

export const getToolbarConfig =
  ({
    breakoutEnabled = true,
    hoverDecoration,
    applyChangeToContextPanel,
    editorAnalyticsAPI,
  }: GetToolbarConfigProps): FloatingToolbarHandler =>
  (state, intl) => {
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

      const editButtonArray = editButton(
        formatMessage,
        extensionState,
        applyChangeToContextPanel,
        editorAnalyticsAPI,
      );
      const breakoutButtonArray = breakoutOptions(
        state,
        formatMessage,
        extensionState,
        breakoutEnabled,
      );

      const extensionObj = getSelectedExtension(state, true);

      // Check if we need to show confirm dialog for delete button
      let confirmDialog;
      if (isReferencedSource(state, extensionObj?.node)) {
        confirmDialog = (): ConfirmDialogOptions => {
          const localSourceName = formatMessage(messages.unnamedSource);
          return {
            title: formatMessage(messages.deleteElementTitle),
            okButtonLabel: formatMessage(
              messages.confirmDeleteLinkedModalOKButton,
            ),
            message: formatMessage(messages.confirmDeleteLinkedModalMessage, {
              nodeName:
                getNodeName(state, extensionObj?.node) || localSourceName,
            }),
            isReferentialityDialog: true,
            getChildrenInfo: () => getChildrenInfo(state, extensionObj?.node),
            checkboxLabel: formatMessage(messages.confirmModalCheckboxLabel),
            onConfirm: (isChecked = false) =>
              clickWithCheckboxHandler(isChecked, extensionObj?.node),
          };
        };
      }

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
            type: 'copy-button',
            items: [
              {
                state,
                formatMessage: intl.formatMessage,
                nodeType,
              },
              { type: 'separator' },
            ],
          },
          {
            id: 'editor.extension.delete',
            type: 'button',
            icon: RemoveIcon,
            appearance: 'danger',
            onClick: removeExtension(),
            onMouseEnter: hoverDecoration?.(nodeType, true),
            onMouseLeave: hoverDecoration?.(nodeType, false),
            onFocus: hoverDecoration?.(nodeType, true),
            onBlur: hoverDecoration?.(nodeType, false),
            focusEditoronEnter: true,
            title: formatMessage(commonMessages.remove),
            tabIndex: null,
            confirmDialog,
          },
        ],
        scrollable: true,
      } as FloatingToolbarConfig;
    }
    return;
  };

const clickWithCheckboxHandler =
  (isChecked: boolean, node?: PMNode): Command =>
  (state, dispatch) => {
    if (!node) {
      return false;
    }

    if (!isChecked) {
      removeExtension()(state, dispatch);
    } else {
      removeDescendantNodes(node)(state, dispatch);
    }
    return true;
  };
