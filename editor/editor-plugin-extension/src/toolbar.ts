import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { messages } from '@atlaskit/editor-common/extensions';
import commonMessages from '@atlaskit/editor-common/messages';
import type {
  Command,
  ConfirmDialogOptions,
  FloatingToolbarConfig,
  FloatingToolbarHandler,
  FloatingToolbarItem,
} from '@atlaskit/editor-common/types';
import {
  getChildrenInfo,
  getNodeName,
  isReferencedSource,
} from '@atlaskit/editor-common/utils';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
  findParentNodeOfType,
  hasParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import { editExtension } from './actions';
import {
  removeDescendantNodes,
  removeExtension,
  updateExtensionLayout,
} from './commands';
import { pluginKey as macroPluginKey } from './pm-plugins/macro/plugin-key';
import { getPluginState } from './pm-plugins/main';
import type { ExtensionState } from './types';
import { getSelectedExtension } from './utils';
import type { Position } from './utils';

const isLayoutSupported = (
  state: EditorState,
  selectedExtNode: { pos: number; node: PMNode },
) => {
  const {
    schema: {
      nodes: {
        bodiedExtension,
        extension,
        layoutSection,
        table,
        expand,
        multiBodiedExtension,
      },
    },
    selection,
  } = state;

  if (!selectedExtNode) {
    return false;
  }

  return !!(
    ([bodiedExtension, multiBodiedExtension].includes(
      selectedExtNode.node.type,
    ) ||
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
        state.schema.nodes.multiBodiedExtension,
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
        onPositionCalculated: (editorView: EditorView, nextPos: Position) => {
          const {
            state: { schema, selection },
          } = editorView;
          const mbeNode = getSelectedExtension(state, true);
          const mbeFrame = findParentNodeOfType(schema.nodes.extensionFrame)(
            selection,
          );
          if (!mbeNode || !mbeFrame) {
            return nextPos;
          }
          const mbeDomElement = editorView.nodeDOM(mbeNode.pos) as HTMLElement;
          const mbeFrameElement = editorView.nodeDOM(
            mbeFrame.pos,
          ) as HTMLElement;
          const mbeNodeRect = mbeDomElement?.getBoundingClientRect();
          const mbeFrameRect = mbeFrameElement.getBoundingClientRect();
          const scrollWrapper =
            editorView.dom.closest('.fabric-editor-popup-scroll-parent') ||
            document.body;

          /**
           * MbeNodeRect height will include mbeFrameRect height and the navigation toolbar of the MBE
           * excluding nav toolbar height from the floaing extention toolbar position calculated.
           * In case of new tabs, MBE does not update the frame to the new tab so height comes as 0,
           * so we add the min height (100px) + borders (2px) as the default minimum frame height for toolbar to appear
           *
           */
          const frameheight =
            mbeFrameRect.height > 0 ? mbeFrameRect.height : 102;
          // MBE wrapper header height includes, top margin 8px + bottom margin 8px + Line height of 16px + padding top 8px
          // Ref: platform/packages/editor/editor-common/src/extensibility/MultiBodiedExtension/styles.ts
          const wrapperHeaderHeight = 40;
          const toolbarTopPos =
            mbeNodeRect.top +
            frameheight +
            wrapperHeaderHeight +
            scrollWrapper.scrollTop;
          return {
            top: toolbarTopPos,
            left: nextPos.left,
          };
        },
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
            onClick: removeExtension(editorAnalyticsAPI),
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
