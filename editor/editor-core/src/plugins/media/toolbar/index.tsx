import React from 'react';
import { InjectedIntl } from 'react-intl';
import { EditorState } from 'prosemirror-state';
import { findParentNodeOfType, removeSelectedNode } from 'prosemirror-utils';
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
import { downloadMedia } from './utils';

const remove: Command = (state, dispatch) => {
  if (dispatch) {
    dispatch(removeSelectedNode(state.tr));
  }
  return true;
};

type RemoveMediaCard = (
  state: EditorState,
  mediaPluginState: MediaPluginState,
) => boolean;

const removeMediaCard: RemoveMediaCard = (
  state: EditorState,
  mediaPluginState: MediaPluginState,
) => {
  const getPos = () => {
    const mediaOffset = state.selection.$from.parentOffset + 1;
    return mediaOffset;
  };
  mediaPluginState.handleMediaNodeRemoval(undefined, getPos);
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
          onClick: () => {
            return true;
          },
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
      onClick: (state) => {
        return removeMediaCard(state, mediaPluginState);
      },
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
  const { media, mediaSingle, mediaGroup } = state.schema.nodes;
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
  const nodeType = allowMediaInline ? [mediaSingle, media] : [mediaSingle];
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
