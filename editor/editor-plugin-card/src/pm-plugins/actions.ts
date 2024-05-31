import type { CardProvider } from '@atlaskit/editor-common/provider-factory';
import type { DatasourceModalType } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DatasourceAdfView } from '@atlaskit/linking-common';
import type { SmartLinkEvents } from '@atlaskit/smart-card';

import type { CardInfo, CardPluginAction, Request } from '../types';
import type { DatasourceTableLayout } from '../ui/LayoutButton/types';

import { pluginKey } from './plugin-key';

export const cardAction = (tr: Transaction, action: CardPluginAction): Transaction => {
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

export const registerRemoveOverlay = (callback: () => void) => (tr: Transaction) =>
	cardAction(tr, {
		type: 'REGISTER_REMOVE_OVERLAY_ON_INSERTED_LINK',
		callback,
	});

export const registerSmartCardEvents = (smartLinkEvents: SmartLinkEvents) => (tr: Transaction) =>
	cardAction(tr, {
		type: 'REGISTER_EVENTS',
		smartLinkEvents,
	});

export const setProvider = (cardProvider: CardProvider | null) => (tr: Transaction) =>
	cardAction(tr, {
		type: 'SET_PROVIDER',
		provider: cardProvider,
	});

export const setDatasourceTableRef = (datasourceTableRef?: HTMLElement) => (tr: Transaction) =>
	cardAction(tr, {
		type: 'SET_DATASOURCE_TABLE_REF',
		datasourceTableRef,
	});

export const setCardLayout = (layout: DatasourceTableLayout) => (tr: Transaction) =>
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

export const showLinkToolbar = (tr: Transaction) => cardAction(tr, { type: 'SHOW_LINK_TOOLBAR' });

export const hideLinkToolbar = (tr: Transaction) => cardAction(tr, { type: 'HIDE_LINK_TOOLBAR' });

export const showDatasourceModal = (modalType: DatasourceModalType) => (tr: Transaction) =>
	cardAction(tr, {
		type: 'SHOW_DATASOURCE_MODAL',
		modalType,
	});

export const hideDatasourceModal = (tr: Transaction) =>
	cardAction(tr, { type: 'HIDE_DATASOURCE_MODAL' });

export const clearOverlayCandidate = (tr: Transaction) =>
	cardAction(tr, { type: 'CLEAR_OVERLAY_CANDIDATE' });

export const setDatasourceStash = (
	tr: Transaction,
	datasourceStash: { url: string; views: DatasourceAdfView[] },
) => cardAction(tr, { type: 'SET_DATASOURCE_STASH', datasourceStash });

export const removeDatasourceStash = (tr: Transaction, url: string) =>
	cardAction(tr, { type: 'REMOVE_DATASOURCE_STASH', url });
