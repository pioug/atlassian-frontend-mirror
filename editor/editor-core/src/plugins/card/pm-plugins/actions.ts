import { Transaction } from 'prosemirror-state';
import { CardProvider } from '@atlaskit/editor-common/provider-factory';

import { pluginKey } from './plugin-key';
import {
  CardPluginAction,
  Request,
  CardInfo,
  SmartLinkEventsNext,
} from '../types';
import { SmartLinkEvents } from '@atlaskit/smart-card';
import { DatasourceTableLayout } from '../ui/LayoutButton/types';

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

export const registerSmartCardEvents =
  (smartLinkEvents: SmartLinkEvents) => (tr: Transaction) =>
    cardAction(tr, {
      type: 'REGISTER_EVENTS',
      smartLinkEvents,
    });

export const registerSmartCardEventsNext =
  (smartLinkEvents: SmartLinkEventsNext) => (tr: Transaction) =>
    cardAction(tr, {
      type: 'REGISTER_EVENTS_NEXT',
      smartLinkEvents,
    });

export const setProvider =
  (cardProvider: CardProvider | null) => (tr: Transaction) =>
    cardAction(tr, {
      type: 'SET_PROVIDER',
      provider: cardProvider,
    });

export const setDatasourceTableRef =
  (datasourceTableRef?: HTMLElement) => (tr: Transaction) =>
    cardAction(tr, {
      type: 'SET_DATASOURCE_TABLE_REF',
      datasourceTableRef,
    });

export const setCardLayout =
  (layout: DatasourceTableLayout) => (tr: Transaction) =>
    cardAction(tr, {
      type: 'SET_CARD_LAYOUT',
      layout,
    });

export const setCardLayoutAndDatasourceTableRef =
  ({
    layout,
    datasourceTableRef,
  }: {
    layout: DatasourceTableLayout;
    datasourceTableRef?: HTMLElement;
  }) =>
  (tr: Transaction) =>
    cardAction(tr, {
      type: 'SET_CARD_LAYOUT_AND_DATASOURCE_TABLE_REF',
      layout,
      datasourceTableRef,
    });

export const showLinkToolbar = (tr: Transaction) =>
  cardAction(tr, { type: 'SHOW_LINK_TOOLBAR' });

export const hideLinkToolbar = (tr: Transaction) =>
  cardAction(tr, { type: 'HIDE_LINK_TOOLBAR' });
