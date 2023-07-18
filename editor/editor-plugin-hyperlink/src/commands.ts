import { Mark, Node, ResolvedPos } from 'prosemirror-model';
import { Selection, Transaction } from 'prosemirror-state';

import { LinkAttributes } from '@atlaskit/adf-schema';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  buildEditLinkPayload,
  EditorAnalyticsAPI,
  EVENT_TYPE,
  INPUT_METHOD,
  unlinkPayload,
  UnlinkToolbarAEP,
} from '@atlaskit/editor-common/analytics';
import {
  addLinkMetadata,
  commandWithMetadata,
} from '@atlaskit/editor-common/card';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import { isTextAtPos, LinkAction } from '@atlaskit/editor-common/link';
import type { Command, LinkInputType } from '@atlaskit/editor-common/types';
import {
  filterCommands as filter,
  getLinkCreationAnalyticsEvent,
  normalizeUrl,
} from '@atlaskit/editor-common/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { stateKey } from './pm-plugins/main';
import { toolbarKey } from './pm-plugins/toolbar-buttons';

export function setLinkHref(
  href: string,
  pos: number,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
  to?: number,
  isTabPressed?: boolean,
): Command {
  return filter(isTextAtPos(pos), (state, dispatch) => {
    const $pos = state.doc.resolve(pos);
    const node = state.doc.nodeAt(pos) as Node;
    const linkMark = state.schema.marks.link;
    const mark = linkMark.isInSet(node.marks) as Mark | undefined;
    const url = normalizeUrl(href);

    if (mark && mark.attrs.href === url) {
      return false;
    }

    const rightBound =
      to && pos !== to ? to : pos - $pos.textOffset + node.nodeSize;

    const tr = state.tr.removeMark(pos, rightBound, linkMark);

    if (href.trim()) {
      tr.addMark(
        pos,
        rightBound,
        linkMark.create({
          ...((mark && mark.attrs) || {}),
          href: url,
        }),
      );
    } else {
      editorAnalyticsApi?.attachAnalyticsEvent(
        unlinkPayload(ACTION_SUBJECT_ID.HYPERLINK) as UnlinkToolbarAEP,
      )(tr);
    }
    if (!isTabPressed) {
      tr.setMeta(stateKey, { type: LinkAction.HIDE_TOOLBAR });
    }

    if (dispatch) {
      dispatch(tr);
    }
    return true;
  });
}

export type UpdateLink = (
  href: string,
  text: string,
  pos: number,
  to?: number,
) => Command;

export function updateLink(
  href: string,
  text: string,
  pos: number,
  to?: number,
): Command {
  return (state, dispatch) => {
    const $pos: ResolvedPos = state.doc.resolve(pos);
    const node: Node | null | undefined = state.doc.nodeAt(pos);
    if (!node) {
      return false;
    }
    const url = normalizeUrl(href);

    const mark = state.schema.marks.link.isInSet(node.marks);
    const linkMark = state.schema.marks.link;

    const rightBound =
      to && pos !== to ? to : pos - $pos.textOffset + node.nodeSize;
    const tr = state.tr;

    if (!url && text) {
      tr.removeMark(pos, rightBound, linkMark);
      tr.insertText(text, pos, rightBound);
    } else if (!url) {
      return false;
    } else {
      tr.insertText(text, pos, rightBound);
      // Casting to LinkAttributes to prevent wrong attributes been passed (Example ED-7951)
      const linkAttrs: LinkAttributes = {
        ...((mark && (mark.attrs as LinkAttributes)) || {}),
        href: url,
      };
      tr.addMark(pos, pos + text.length, linkMark.create(linkAttrs));
      tr.setMeta(stateKey, { type: LinkAction.HIDE_TOOLBAR });
    }

    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}

export function insertLink(
  from: number,
  to: number,
  incomingHref: string,
  incomingTitle?: string,
  displayText?: string,
  source?: LinkInputType,
  sourceEvent?: UIAnalyticsEvent | null | undefined,
): Command {
  return (state, dispatch) => {
    const link = state.schema.marks.link;
    const { tr } = state;
    if (incomingHref.trim()) {
      const normalizedUrl = normalizeUrl(incomingHref);
      // NB: in this context, `currentText` represents text which has been
      // highlighted in the Editor, upon which a link is is being added.
      const currentText = stateKey.getState(state)?.activeText;

      let markEnd = to;
      const text = displayText || incomingTitle || incomingHref;
      if (!displayText || displayText !== currentText) {
        tr.insertText(text, from, to);
        if (!isTextAtPos(from)(state)) {
          markEnd = from + text.length + 1;
        } else {
          markEnd = from + text.length;
        }
      }

      tr.addMark(from, markEnd, link.create({ href: normalizedUrl }));
      tr.setSelection(Selection.near(tr.doc.resolve(markEnd)));

      if (!displayText || displayText === incomingHref) {
        const queueCardsFromChangedTr =
          toolbarKey.getState(state)?.onInsertLinkCallback;

        if (queueCardsFromChangedTr) {
          queueCardsFromChangedTr?.(
            state,
            tr,
            source!,
            ACTION.INSERTED,
            false,
            sourceEvent,
          );
        } else {
          addLinkMetadata(state.selection, tr, {
            action: ACTION.INSERTED,
            inputMethod: source,
            sourceEvent,
          });
        }
      } else if (
        getBooleanFF(
          'platform.linking-platform.editor.fix-link-insert-analytics',
        )
      ) {
        /**
         * Add link metadata because queue cards would have otherwise handled this for us
         */
        addLinkMetadata(state.selection, tr, {
          action: ACTION.INSERTED,
          inputMethod: source,
          sourceEvent,
        });
      }

      tr.setMeta(stateKey, { type: LinkAction.HIDE_TOOLBAR });
      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }
    tr.setMeta(stateKey, { type: LinkAction.HIDE_TOOLBAR });
    if (dispatch) {
      dispatch(tr);
    }
    return false;
  };
}

export type InsertLink = (
  inputMethod: LinkInputType,
  from: number,
  to: number,
  href: string,
  title?: string,
  displayText?: string,
  cardsAvailable?: boolean,
  sourceEvent?: UIAnalyticsEvent | null | undefined,
) => Command;

export const insertLinkWithAnalytics = (
  inputMethod: LinkInputType,
  from: number,
  to: number,
  href: string,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
  title?: string,
  displayText?: string,
  cardsAvailable: boolean = false,
  sourceEvent: UIAnalyticsEvent | null | undefined = undefined,
) => {
  // If smart cards are available, we send analytics for hyperlinks when a smart link is rejected.
  if (cardsAvailable && !title && !displayText) {
    return insertLink(
      from,
      to,
      href,
      title,
      displayText,
      inputMethod,
      sourceEvent,
    );
  }
  return withAnalytics(
    editorAnalyticsApi,
    getLinkCreationAnalyticsEvent(inputMethod, href),
  )(insertLink(from, to, href, title, displayText, inputMethod, sourceEvent));
};

export function removeLink(
  pos: number,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Command {
  return commandWithMetadata(setLinkHref('', pos, editorAnalyticsApi), {
    action: ACTION.UNLINK,
  });
}

export function editInsertedLink(
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Command {
  return (state, dispatch) => {
    if (dispatch) {
      const { tr } = state;
      tr.setMeta(stateKey, {
        type: LinkAction.EDIT_INSERTED_TOOLBAR,
        inputMethod: INPUT_METHOD.FLOATING_TB,
      });
      editorAnalyticsApi?.attachAnalyticsEvent(
        buildEditLinkPayload(ACTION_SUBJECT_ID.HYPERLINK),
      )(tr);
      dispatch(tr);
    }
    return true;
  };
}

type InputMethod =
  | INPUT_METHOD.TOOLBAR
  | INPUT_METHOD.QUICK_INSERT
  | INPUT_METHOD.SHORTCUT
  | INPUT_METHOD.INSERT_MENU;

export type ShowLinkToolbar = (inputMethod: InputMethod) => Command;

export function showLinkToolbar(
  inputMethod: InputMethod,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Command {
  return function (state, dispatch) {
    if (dispatch) {
      const tr = state.tr.setMeta(stateKey, {
        type: LinkAction.SHOW_INSERT_TOOLBAR,
        inputMethod,
      });
      editorAnalyticsApi?.attachAnalyticsEvent({
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.TYPEAHEAD,
        actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
        attributes: { inputMethod },
        eventType: EVENT_TYPE.UI,
      })(tr);
      dispatch(tr);
    }
    return true;
  };
}

export function hideLinkToolbar(): Command {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(hideLinkToolbarSetMeta(state.tr));
    }
    return true;
  };
}

export type HideLinkToolbar = (tr: Transaction) => Transaction;
export const hideLinkToolbarSetMeta: HideLinkToolbar = (tr: Transaction) => {
  return tr.setMeta(stateKey, { type: LinkAction.HIDE_TOOLBAR });
};

export const onEscapeCallback: Command = (state, dispatch) => {
  const { tr } = state;
  hideLinkToolbarSetMeta(tr);
  toolbarKey.getState(state)?.onEscapeCallback?.(tr);
  if (dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
};

export const onClickAwayCallback: Command = (state, dispatch) => {
  if (dispatch) {
    hideLinkToolbar()(state, dispatch);
    return true;
  }
  return false;
};
