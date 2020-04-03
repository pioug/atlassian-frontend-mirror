import { EditorView } from 'prosemirror-view';
import {
  createMediaLinkingCommand,
  getMediaLinkingState,
} from '../pm-plugins/linking';
import { Node, MarkType } from 'prosemirror-model';
import { normalizeUrl } from '../../hyperlink/utils';
import { CommandDispatch } from '../../../types/command';
import { createToggleBlockMarkOnRange } from '../../../commands';
import { LinkAttributes } from '@atlaskit/adf-schema';
import { MediaLinkingActionsTypes } from '../pm-plugins/linking/actions';
import { EditorState, Transaction } from 'prosemirror-state';
import {
  addAnalytics,
  EVENT_TYPE,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
} from '../../analytics';

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

const hideLinkingToolbarCommand = createMediaLinkingCommand({
  type: MediaLinkingActionsTypes.hideToolbar,
});
export const hideLinkingToolbar = (
  state: EditorState,
  dispatch?: CommandDispatch,
  view?: EditorView,
) => {
  hideLinkingToolbarCommand(state, dispatch, view);

  // restore focus on the editor so keyboard shortcuts aren't lost to the browser
  if (view) {
    view.focus();
  }
};

interface CreateToggleLinkMarkOptions {
  forceRemove?: boolean;
  url?: string;
}
function getCurrentUrl(state: EditorState): string | undefined {
  const { link: linkType }: { link: MarkType } = state.schema.marks;
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
  const { mediaSingle } = state.schema.nodes;
  const toggleBlockLinkMark = createToggleBlockMarkOnRange<LinkAttributes>(
    linkMark,
    (prevAttrs, node) => {
      // Only add mark to media single
      if (!node || node.type !== mediaSingle) {
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
    [mediaSingle],
  );
  toggleBlockLinkMark($pos.pos, $pos.pos + node.nodeSize - 1, tr, state);

  return tr;
}

export const unlink = createMediaLinkingCommand(
  {
    type: MediaLinkingActionsTypes.unlink,
  },
  (tr, state) => {
    return addAnalytics(
      state,
      toggleLinkMark(tr, state, { forceRemove: true }),
      {
        eventType: EVENT_TYPE.TRACK,
        action: ACTION.UNLINK,
        actionSubject: ACTION_SUBJECT.MEDIA_SINGLE,
        actionSubjectId: ACTION_SUBJECT_ID.MEDIA_LINK,
      },
    );
  },
);

export const setUrlToMedia = (
  url: string,
  inputMethod: INPUT_METHOD.TYPEAHEAD | INPUT_METHOD.MANUAL,
) =>
  createMediaLinkingCommand(
    {
      type: MediaLinkingActionsTypes.setUrl,
      payload: normalizeUrl(url),
    },
    (tr, state) => {
      const currentUrl = getCurrentUrl(state);
      if (!currentUrl) {
        // Insert Media Link
        addAnalytics(state, tr, {
          eventType: EVENT_TYPE.TRACK,
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          actionSubjectId: ACTION_SUBJECT_ID.MEDIA_LINK,
          attributes: {
            inputMethod,
          },
        });
      } else if (url !== currentUrl) {
        // Change Url Event
        addAnalytics(state, tr, {
          eventType: EVENT_TYPE.TRACK,
          action: ACTION.CHANGED_URL,
          actionSubject: ACTION_SUBJECT.MEDIA_SINGLE,
          actionSubjectId: ACTION_SUBJECT_ID.MEDIA_LINK,
        });
      }

      return toggleLinkMark(tr, state, { url: url });
    },
  );
