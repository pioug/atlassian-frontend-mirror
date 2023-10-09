import type { LinkAttributes } from '@atlaskit/adf-schema';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type {
  EditorAnalyticsAPI,
  INPUT_METHOD,
  MediaLinkAEP,
} from '@atlaskit/editor-common/analytics';
import { createToggleBlockMarkOnRange } from '@atlaskit/editor-common/commands';
import type { Command, CommandDispatch } from '@atlaskit/editor-common/types';
import { normalizeUrl } from '@atlaskit/editor-common/utils';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import {
  createMediaLinkingCommand,
  getMediaLinkingState,
  mediaLinkingPluginKey,
} from '../pm-plugins/linking';
import { MediaLinkingActionsTypes } from '../pm-plugins/linking/actions';
import { getMediaPluginState } from '../pm-plugins/main';
import { checkMediaType } from '../utils/check-media-type';
import { currentMediaNode } from '../utils/current-media-node';

export const showLinkingToolbar = createMediaLinkingCommand(state => {
  const mediaLinkingState = getMediaLinkingState(state);
  if (mediaLinkingState && mediaLinkingState.mediaPos !== null) {
    const mediaSingle = state.doc.nodeAt(mediaLinkingState.mediaPos);
    if (mediaSingle) {
      return {
        type: MediaLinkingActionsTypes.showToolbar,
      };
    }
  }
  return false;
});

export const showLinkingToolbarWithMediaTypeCheck: Command = (
  editorState,
  dispatch,
  editorView,
) => {
  if (dispatch && editorView) {
    const mediaNode = currentMediaNode(editorState);

    if (!mediaNode) {
      return false;
    }

    const { mediaClientConfig } = getMediaPluginState(editorState);

    if (!mediaClientConfig) {
      return false;
    }

    checkMediaType(mediaNode, mediaClientConfig).then(mediaType => {
      if (
        (mediaType === 'external' || mediaType === 'image') &&
        // We make sure the selection and the node hasn't changed.
        currentMediaNode(editorView.state) === mediaNode
      ) {
        dispatch(
          editorView.state.tr.setMeta(mediaLinkingPluginKey, {
            type: MediaLinkingActionsTypes.showToolbar,
          }),
        );
      }
    });
  }
  return true;
};

const hideLinkingToolbarCommand = createMediaLinkingCommand({
  type: MediaLinkingActionsTypes.hideToolbar,
});
export const hideLinkingToolbar = (
  state: EditorState,
  dispatch?: CommandDispatch,
  view?: EditorView,
  focusFloatingToolbar?: boolean,
) => {
  hideLinkingToolbarCommand(state, dispatch, view);

  // restore focus on the editor so keyboard shortcuts aren't lost to the browser
  if (view && !focusFloatingToolbar) {
    view.focus();
  }
};

interface CreateToggleLinkMarkOptions {
  forceRemove?: boolean;
  url?: string;
}
function getCurrentUrl(state: EditorState): string | undefined {
  const { link: linkType } = state.schema.marks;
  const mediaLinkingState = getMediaLinkingState(state);
  if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
    return;
  }
  const $pos = state.doc.resolve(mediaLinkingState.mediaPos);
  const node = state.doc.nodeAt($pos.pos) as Node;

  if (!node) {
    return;
  }

  const hasLink = linkType.isInSet(node.marks);
  if (!hasLink) {
    return;
  }
  const link = node.marks.find(mark => mark.type === linkType)!; // Already check exist
  const url = (link.attrs as LinkAttributes).href;

  return url;
}

function toggleLinkMark(
  tr: Transaction,
  state: EditorState,
  { forceRemove = false, url }: CreateToggleLinkMarkOptions,
) {
  const mediaLinkingState = getMediaLinkingState(state);
  if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
    return tr;
  }
  const $pos = state.doc.resolve(mediaLinkingState.mediaPos);
  const node = state.doc.nodeAt($pos.pos) as Node;

  if (!node) {
    return tr;
  }

  const linkMark = state.schema.marks.link;
  const { media } = state.schema.nodes;
  const toggleBlockLinkMark = createToggleBlockMarkOnRange<LinkAttributes>(
    linkMark,
    (prevAttrs, node) => {
      // Only add mark to media
      if (!node || node.type !== media) {
        return; //No op
      }
      if (forceRemove) {
        return false;
      }
      const href = normalizeUrl(url);

      if (prevAttrs && prevAttrs.href === href) {
        return; //No op
      }

      if (href.trim() === '') {
        return false; // remove
      }

      return {
        ...prevAttrs,
        href: href,
      };
    },
    [media],
  );
  toggleBlockLinkMark($pos.pos, $pos.pos + node.nodeSize, tr, state);

  return tr;
}

const fireAnalyticForMediaLink = <T extends MediaLinkAEP>(
  tr: Transaction,
  action: T['action'],
  attributes: T['attributes'] = undefined,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) => {
  editorAnalyticsAPI?.attachAnalyticsEvent({
    action,
    eventType: EVENT_TYPE.TRACK,
    actionSubject: ACTION_SUBJECT.MEDIA,
    actionSubjectId: ACTION_SUBJECT_ID.LINK,
    attributes,
  })(tr);
  return tr;
};

export const unlink = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  createMediaLinkingCommand(
    {
      type: MediaLinkingActionsTypes.unlink,
    },
    (tr, state) => {
      const transaction = toggleLinkMark(tr, state, { forceRemove: true });
      return fireAnalyticForMediaLink(
        transaction,
        ACTION.DELETED,
        undefined,
        editorAnalyticsAPI,
      );
    },
  );

const getAction = (newUrl: string, state: EditorState) => {
  const currentUrl = getCurrentUrl(state);
  if (!currentUrl) {
    return ACTION.ADDED;
  } else if (newUrl !== currentUrl) {
    return ACTION.EDITED;
  }
  return undefined;
};

export const setUrlToMedia = (
  url: string,
  inputMethod: INPUT_METHOD.TYPEAHEAD | INPUT_METHOD.MANUAL,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) =>
  createMediaLinkingCommand(
    {
      type: MediaLinkingActionsTypes.setUrl,
      payload: normalizeUrl(url),
    },
    (tr, state) => {
      const action = getAction(url, state);
      if (!action) {
        return tr;
      }

      try {
        const toggleLinkMarkResult = toggleLinkMark(tr, state, { url: url });
        fireAnalyticForMediaLink(
          tr,
          action,
          action === ACTION.ADDED ? { inputMethod } : undefined,
          editorAnalyticsAPI,
        );
        return toggleLinkMarkResult;
      } catch (e) {
        fireAnalyticForMediaLink(
          tr,
          ACTION.ERRORED,
          {
            action: action,
          },
          editorAnalyticsAPI,
        );
        throw e;
      }
    },
  );
