/**
 * WARNING!!!
 * Copied from `editor-plugin-card`.
 *
 * This workaround is used since we extracted the hyperlink + card plugins.
 * It is only used in `deprecated-hyperlink`. It should not be used internally or externally.
 *
 */
import { EditorState, Transaction, PluginKey } from 'prosemirror-state';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ACTION } from '@atlaskit/editor-common/analytics';
import type { CardReplacementInputMethod } from '@atlaskit/editor-common/card';
import { addLinkMetadata } from '@atlaskit/editor-common/card';
import { nodesBetweenChanged } from '@atlaskit/editor-common/utils';

import type { Request } from '@atlaskit/editor-plugin-card';

import { Node } from 'prosemirror-model';

import { normalizeUrl } from '@atlaskit/adf-schema';
import { md } from '@atlaskit/editor-common/paste';

// TODO: ED-15663
// Please, do not copy or use this kind of code below
// @ts-ignore
const pluginKey = {
  key: 'cardPlugin$',
  getState: (state: EditorState) => {
    return (state as any)['cardPlugin$'];
  },
} as PluginKey;

function shouldReplaceLink(
  node: Node,
  compareLinkText: boolean = true,
  compareToUrl?: string,
) {
  const linkMark = node.marks.find((mark) => mark.type.name === 'link');
  if (!linkMark) {
    // not a link anymore
    return false;
  }

  // ED-6041: compare normalised link text after linkfy from Markdown transformer
  // instead, since it always decodes URL ('%20' -> ' ') on the link text

  const normalisedHref = normalizeUrl(
    md.normalizeLinkText(linkMark.attrs.href),
  );

  const normalizedLinkText = normalizeUrl(
    md.normalizeLinkText(node.text || ''),
  );

  if (compareLinkText && normalisedHref !== normalizedLinkText) {
    return false;
  }

  if (compareToUrl) {
    const normalizedUrl = normalizeUrl(md.normalizeLinkText(compareToUrl));
    if (normalizedUrl !== normalisedHref) {
      return false;
    }
  }

  return true;
}

interface CardPluginAction {
  type: 'QUEUE';
  requests: Request[];
}

const cardAction = (tr: Transaction, action: CardPluginAction): Transaction => {
  return tr.setMeta(pluginKey, action);
};

const queueCards = (requests: Request[]) => (tr: Transaction) =>
  cardAction(tr, {
    type: 'QUEUE',
    requests: requests,
  });

/**
 * @private
 * @deprecated
 *
 * DO NOT USE THIS
 * It is only used internally for `deprecated-hyperlink`.
 */
export const queueCardsFromChangedTr = (
  state: EditorState,
  tr: Transaction,
  source: CardReplacementInputMethod,
  analyticsAction?: ACTION,
  normalizeLinkText: boolean = true,
  sourceEvent: UIAnalyticsEvent | null | undefined = undefined,
): Transaction => {
  const { schema } = state;
  const { link } = schema.marks;

  const requests: Request[] = [];

  nodesBetweenChanged(tr, (node, pos) => {
    if (!node.isText) {
      return true;
    }

    const linkMark = node.marks.find((mark) => mark.type === link);

    if (linkMark) {
      if (!shouldReplaceLink(node, normalizeLinkText)) {
        return false;
      }

      requests.push({
        url: linkMark.attrs.href,
        pos,
        appearance: 'inline',
        compareLinkText: normalizeLinkText,
        source,
        analyticsAction,
        sourceEvent,
      });
    }

    return false;
  });

  if (analyticsAction) {
    addLinkMetadata(state.selection, tr, {
      action: analyticsAction,
    });
  }

  return queueCards(requests)(tr);
};
