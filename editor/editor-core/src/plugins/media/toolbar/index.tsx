import React from 'react';
import { InjectedIntl } from 'react-intl';
import { EditorState, NodeSelection } from 'prosemirror-state';
import {
  findParentNodeOfType,
  removeSelectedNode,
  safeInsert,
} from 'prosemirror-utils';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { mediaFilmstripItemDOMSelector } from '@atlaskit/media-filmstrip';
import commonMessages from '../../../messages';
import { Command } from '../../../types';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
} from '../../../plugins/floating-toolbar/types';
import { stateKey } from '../pm-plugins/plugin-key';
import { hoverDecoration } from '../../base/pm-plugins/decoration';
import { renderAnnotationButton } from './annotation';
import { getLinkingToolbar, shouldShowMediaLinkToolbar } from './linking';
import buildLayoutButtons from '../../../ui/MediaAndEmbedsToolbar';
import { MediaLinkingState, getMediaLinkingState } from '../pm-plugins/linking';
import { getPluginState as getMediaAltTextPluginState } from '../pm-plugins/alt-text';
import { altTextButton, getAltTextToolbar } from './alt-text';
import { MediaFloatingToolbarOptions } from '../types';
import { MediaPluginState } from '../pm-plugins/types';
import { showLinkingToolbar } from '../commands/linking';
import { LinkToolbarAppearance } from './linking-toolbar-appearance';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
} from '../../analytics';
import { messages } from '@atlaskit/media-ui';
import { messages as cardMessages } from '../../card/messages';
import { FilePreviewItem } from './filePreviewItem';
import { downloadMedia, removeMediaGroupNode } from './utils';
import { Fragment } from 'prosemirror-model';

const remove: Command = (state, dispatch) => {
  if (dispatch) {
    dispatch(removeSelectedNode(state.tr));
  }
  return true;
};

const handleRemoveMediaGroup: Command = (state, dispatch) => {
  const tr = removeMediaGroupNode(state);
  if (dispatch) {
    dispatch(tr);
  }
  return true;
};

const changeMediaCardToInline: Command = (state, dispatch) => {
  const { media, mediaInline, paragraph } = state.schema.nodes;
  const selectedNode =
    state.selection instanceof NodeSelection && state.selection.node;

  if (!selectedNode || !selectedNode.type === media) {
    return false;
  }

  const mediaInlineNode = mediaInline.create({
    id: selectedNode.attrs.id,
    collection: selectedNode.attrs.collection,
  });
  const space = state.schema.text(' ');
  let content = Fragment.from([mediaInlineNode, space]);
  const node = paragraph.createChecked({}, content);

  const nodePos = state.tr.doc.resolve(state.selection.from).start() - 1;

  let tr = removeMediaGroupNode(state);
  tr = safeInsert(node, nodePos, true)(tr);

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

const generateMediaCardFloatingToolbar = (
  state: EditorState,
  intl: InjectedIntl,
  mediaPluginState: MediaPluginState,
) => {
  const { mediaGroup } = state.schema.nodes;
  const items: FloatingToolbarItem<Command>[] = [
    {
      type: 'dropdown',
      title: intl.formatMessage(messages.displayThumbnail),
      options: [
        {
          title: intl.formatMessage(cardMessages.inline),
          selected: false,
          onClick: changeMediaCardToInline,
          testId: 'inline-appearance',
        },
        {
          title: intl.formatMessage(messages.displayThumbnail),
          selected: true,
          onClick: () => {
            return true;
          },
          testId: 'thumbnail-appearance',
        },
      ],
    },
    {
      type: 'separator',
    },
    {
      type: 'custom',
      fallback: [],
      render: () => {
        return (
          <FilePreviewItem
            key="editor.media.card.preview"
            mediaPluginState={mediaPluginState}
          />
        );
      },
    },
    { type: 'separator' },
    {
      id: 'editor.media.card.download',
      type: 'button',
      icon: DownloadIcon,
      onClick: () => {
        downloadMedia(mediaPluginState);
        return true;
      },
      title: intl.formatMessage(messages.download),
    },
    { type: 'separator' },
    {
      id: 'editor.media.delete',
      type: 'button',
      appearance: 'danger',
      icon: RemoveIcon,
      onMouseEnter: hoverDecoration(mediaGroup, true),
      onMouseLeave: hoverDecoration(mediaGroup, false),
      onFocus: hoverDecoration(mediaGroup, true),
      onBlur: hoverDecoration(mediaGroup, false),
      title: intl.formatMessage(commonMessages.remove),
      onClick: handleRemoveMediaGroup,
      testId: 'media-toolbar-remove-button',
    },
  ];

  return items;
};

const generateMediaSingleFloatingToolbar = (
  state: EditorState,
  intl: InjectedIntl,
  options: MediaFloatingToolbarOptions,
  pluginState: MediaPluginState,
  mediaLinkingState: MediaLinkingState,
) => {
  const { mediaSingle } = state.schema.nodes;
  const {
    allowResizing,
    allowAnnotation,
    allowLinking,
    allowAdvancedToolBarOptions,
    allowResizingInTables,
    allowAltTextOnImages,
  } = options;

  let toolbarButtons: FloatingToolbarItem<Command>[] = [];
  if (allowAdvancedToolBarOptions) {
    toolbarButtons = buildLayoutButtons(
      state,
      intl,
      state.schema.nodes.mediaSingle,
      allowResizing,
      allowResizingInTables,
    );
    if (toolbarButtons.length) {
      if (allowAnnotation) {
        toolbarButtons.push({
          type: 'custom',
          fallback: [],
          render: renderAnnotationButton(pluginState, intl),
        });
      }
    }

    if (toolbarButtons.length) {
      toolbarButtons.push({ type: 'separator' });
    }

    if (allowLinking && shouldShowMediaLinkToolbar(state)) {
      toolbarButtons.push({
        type: 'custom',
        fallback: [],
        render: (editorView, idx) => {
          if (editorView?.state) {
            const editLink = () => {
              if (editorView) {
                const { state, dispatch } = editorView;
                showLinkingToolbar(state, dispatch);
              }
            };

            const openLink = () => {
              if (editorView) {
                const { state, dispatch } = editorView;
                dispatch(
                  addAnalytics(state, state.tr, {
                    eventType: EVENT_TYPE.TRACK,
                    action: ACTION.VISITED,
                    actionSubject: ACTION_SUBJECT.MEDIA,
                    actionSubjectId: ACTION_SUBJECT_ID.LINK,
                  }),
                );
                return true;
              }
            };

            return (
              <LinkToolbarAppearance
                key={idx}
                editorState={editorView.state}
                intl={intl}
                mediaLinkingState={mediaLinkingState}
                onAddLink={editLink}
                onEditLink={editLink}
                onOpenLink={openLink}
              />
            );
          }
          return null;
        },
      });
    }
  }

  if (allowAltTextOnImages) {
    toolbarButtons.push(altTextButton(intl, state), { type: 'separator' });
  }
  const removeButton: FloatingToolbarItem<Command> = {
    id: 'editor.media.delete',
    type: 'button',
    appearance: 'danger',
    icon: RemoveIcon,
    onMouseEnter: hoverDecoration(mediaSingle, true),
    onMouseLeave: hoverDecoration(mediaSingle, false),
    onFocus: hoverDecoration(mediaSingle, true),
    onBlur: hoverDecoration(mediaSingle, false),
    title: intl.formatMessage(commonMessages.remove),
    onClick: remove,
    testId: 'media-toolbar-remove-button',
  };
  const items: Array<FloatingToolbarItem<Command>> = [
    ...toolbarButtons,
    removeButton,
  ];

  return items;
};

export const floatingToolbar = (
  state: EditorState,
  intl: InjectedIntl,
  options: MediaFloatingToolbarOptions = {},
): FloatingToolbarConfig | undefined => {
  const { media, mediaInline, mediaSingle, mediaGroup } = state.schema.nodes;
  const {
    altTextValidator,
    allowLinking,
    allowAltTextOnImages,
    providerFactory,
    allowMediaInline,
  } = options;
  const mediaPluginState: MediaPluginState | undefined = stateKey.getState(
    state,
  );
  const mediaLinkingState: MediaLinkingState = getMediaLinkingState(state);

  if (!mediaPluginState) {
    return;
  }
  const nodeType = allowMediaInline
    ? [mediaInline, mediaSingle, media]
    : [mediaSingle];
  const baseToolbar = {
    title: 'Media floating controls',
    nodeType,
    getDomRef: () => mediaPluginState.element,
  };

  if (
    allowLinking &&
    mediaLinkingState &&
    mediaLinkingState.visible &&
    shouldShowMediaLinkToolbar(state)
  ) {
    const linkingToolbar = getLinkingToolbar(
      baseToolbar,
      mediaLinkingState,
      state,
      intl,
      providerFactory,
    );
    if (linkingToolbar) {
      return linkingToolbar;
    }
  }

  if (allowAltTextOnImages) {
    const mediaAltTextPluginState = getMediaAltTextPluginState(state);
    if (mediaAltTextPluginState.isAltTextEditorOpen) {
      return getAltTextToolbar(baseToolbar, {
        altTextValidator,
      });
    }
  }

  let items: FloatingToolbarItem<Command>[] = [];
  const parentNode = findParentNodeOfType(mediaGroup)(state.selection);
  if (allowMediaInline && parentNode && parentNode.node.type === mediaGroup) {
    const mediaOffset = state.selection.$from.parentOffset + 1;
    baseToolbar.getDomRef = () => {
      const selector = mediaFilmstripItemDOMSelector(mediaOffset);
      return mediaPluginState.element?.querySelector(selector) as HTMLElement;
    };
    items = generateMediaCardFloatingToolbar(state, intl, mediaPluginState);
  } else {
    items = generateMediaSingleFloatingToolbar(
      state,
      intl,
      options,
      mediaPluginState,
      mediaLinkingState,
    );
  }

  return {
    ...baseToolbar,
    items,
  };
};
