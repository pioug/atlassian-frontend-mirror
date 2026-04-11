import type { CardProvider } from '@atlaskit/editor-common/provider-factory';
import type { DatasourceModalType } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { DatasourceAdfView } from '@atlaskit/linking-common';
import type { SmartLinkEvents } from '@atlaskit/smart-card';

import type { CardInfo, CardPluginAction, Request, ToolbarResolvedAttributes } from '../types';
import type { DatasourceTableLayout } from '../ui/LayoutButton/types';

import { pluginKey } from './plugin-key';

export const cardAction = (tr: Transaction, action: CardPluginAction): Transaction => {
	return tr.setMeta(pluginKey, action);
};

export const resolveCard =
	(url: string) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'RESOLVE',
			url,
		});

export const queueCards =
	(requests: Request[]) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'QUEUE',
			requests: requests,
		});

export const registerCard =
	(info: CardInfo) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'REGISTER',
			info,
		});

export const removeCard =
	(info: Partial<CardInfo>) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'REMOVE_CARD',
			info,
		});

export const registerRemoveOverlay =
	(callback: () => void, info?: CardInfo) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'REGISTER_REMOVE_OVERLAY_ON_INSERTED_LINK',
			callback,
			info,
		});

export const registerSmartCardEvents =
	(smartLinkEvents: SmartLinkEvents) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'REGISTER_EVENTS',
			smartLinkEvents,
		});

export const setProvider =
	(cardProvider: CardProvider | null) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'SET_PROVIDER',
			provider: cardProvider,
		});

export const setDatasourceTableRef =
	(datasourceTableRef?: HTMLElement) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'SET_DATASOURCE_TABLE_REF',
			datasourceTableRef,
		});

export const setResolvedToolbarAttributes =
	(url: string, attributes: ToolbarResolvedAttributes) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'SET_RESOLVED_TOOLBAR_ATTRIBUTES',
			url,
			attributes,
		});

export const setCardLayout =
	(layout: DatasourceTableLayout) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'SET_CARD_LAYOUT',
			layout,
		});

export const setCardLayoutAndDatasourceTableRef =
	({
		layout,
		datasourceTableRef,
	}: {
		datasourceTableRef?: HTMLElement;
		layout: DatasourceTableLayout;
	}) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'SET_CARD_LAYOUT_AND_DATASOURCE_TABLE_REF',
			layout,
			datasourceTableRef,
		});

export const showLinkToolbar = (tr: Transaction): Transaction =>
	cardAction(tr, { type: 'SHOW_LINK_TOOLBAR' });

export const hideLinkToolbar = (tr: Transaction): Transaction =>
	cardAction(tr, { type: 'HIDE_LINK_TOOLBAR' });

export const showDatasourceModal =
	(modalType: DatasourceModalType) =>
	(tr: Transaction): Transaction =>
		cardAction(tr, {
			type: 'SHOW_DATASOURCE_MODAL',
			modalType,
		});

export const hideDatasourceModal = (tr: Transaction): Transaction =>
	cardAction(tr, { type: 'HIDE_DATASOURCE_MODAL' });

export const clearOverlayCandidate = (tr: Transaction): Transaction =>
	cardAction(tr, { type: 'CLEAR_OVERLAY_CANDIDATE' });

export const setDatasourceStash = (
	tr: Transaction,
	datasourceStash: { url: string; views: DatasourceAdfView[] },
): Transaction => cardAction(tr, { type: 'SET_DATASOURCE_STASH', datasourceStash });

export const removeDatasourceStash = (tr: Transaction, url: string): Transaction =>
	cardAction(tr, { type: 'REMOVE_DATASOURCE_STASH', url });
