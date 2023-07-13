import { LinkAttributes } from '@atlaskit/adf-schema';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { addLinkMetadata } from '@atlaskit/editor-common/card';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { isTextAtPos, LinkAction } from '@atlaskit/editor-common/link';
import {
  getLinkCreationAnalyticsEvent,
  normalizeUrl,
} from '@atlaskit/editor-common/utils';
import { Selection } from 'prosemirror-state';

import { ACTION } from '@atlaskit/editor-common/analytics';
import type { Command, LinkInputType } from '@atlaskit/editor-common/types';
import { Node, ResolvedPos } from 'prosemirror-model';
import { withAnalytics } from '../analytics';
import { queueCardsFromChangedTr } from '../card/pm-plugins/doc';

import { PluginKey, EditorState } from 'prosemirror-state';
// TODO: ED-17836 This workaround is used since we extracted the hyperlink plugin.
// As soon as we deprecate the plugin we can delete this code.
/**
 * @deprecated
 * Please do not use this key anymore it will be removed soon.
 * Using plugin keys is a deprecated approach and if you need
 * to access state use the Preset API in EditorNext.
 */
export const stateKey = {
  key: 'hyperlinkPlugin$',
  getState: (state: EditorState) => {
    return (state as any)['hyperlinkPlugin$'];
  },
} as unknown as PluginKey;

/**
 * @deprecated
 * Please do not use this function anymore it will be removed soon.
 * If you need to update the link please do it through the Preset
 * API in EditorNext.
 */
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

/**
 * @deprecated
 * Please do not use this function anymore it will be removed soon.
 * If you need to insert link please do it through the Preset
 * API in EditorNext.
 */
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
        queueCardsFromChangedTr(
          state,
          tr,
          source!,
          ACTION.INSERTED,
          false,
          sourceEvent,
        );
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

/**
 * @deprecated
 * Please do not use this function anymore it will be removed soon.
 * If you need to insert link please do it through the Preset
 * API in EditorNext.
 */
export const insertLinkWithAnalytics = (
  inputMethod: LinkInputType,
  from: number,
  to: number,
  href: string,
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
  return withAnalytics(getLinkCreationAnalyticsEvent(inputMethod, href))(
    insertLink(from, to, href, title, displayText, inputMethod, sourceEvent),
  );
};

/**
 * @deprecated
 * Please do not use this function anymore it will be removed soon.
 * If you need to insert link please do it through the Preset
 * API in EditorNext.
 */
export const insertLinkWithAnalyticsMobileNative = (
  inputMethod: LinkInputType,
  from: number,
  to: number,
  href: string,
  title?: string,
  displayText?: string,
) => {
  return withAnalytics(getLinkCreationAnalyticsEvent(inputMethod, href))(
    insertLink(from, to, href, title, displayText, inputMethod),
  );
};
