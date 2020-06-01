import { Transaction } from 'prosemirror-state';
import { CardProvider } from '@atlaskit/editor-common/provider-factory';

import { pluginKey } from './plugin-key';
import { CardPluginAction, Request, CardInfo } from '../types';

export const cardAction = (
  tr: Transaction,
  action: CardPluginAction,
): Transaction => {
  return tr.setMeta(pluginKey, action);
};

export const resolveCard = (url: string) => (tr: Transaction) =>
  cardAction(tr, {
    type: 'RESOLVE',
    url,
  });

export const queueCards = (requests: Request[]) => (tr: Transaction) =>
  cardAction(tr, {
    type: 'QUEUE',
    requests: requests,
  });

export const registerCard = (info: CardInfo) => (tr: Transaction) =>
  cardAction(tr, {
    type: 'REGISTER',
    info,
  });

export const setProvider = (cardProvider: CardProvider | null) => (
  tr: Transaction,
) =>
  cardAction(tr, {
    type: 'SET_PROVIDER',
    provider: cardProvider,
  });

export const showLinkToolbar = (tr: Transaction) =>
  cardAction(tr, { type: 'SHOW_LINK_TOOLBAR' });

export const hideLinkToolbar = (tr: Transaction) =>
  cardAction(tr, { type: 'HIDE_LINK_TOOLBAR' });
