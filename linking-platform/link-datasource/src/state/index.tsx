import React from 'react';

import {
	type Action,
	createActionsHook,
	createContainer,
	createStateHook,
	createStore,
} from 'react-sweet-state';
import { v4 as uuidv4 } from 'uuid';

import type { DatasourceDataResponseItem } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

type Actions = typeof actions;

type UniqueIdentifier = string;

interface DatasourceItem {
	ari: string | undefined;
	integrationKey: string | undefined;
	data: DatasourceDataResponseItem;
}

export interface State {
	items: Record<UniqueIdentifier, DatasourceItem>;
}

const getInitialState: () => State = () => ({
	items: {},
});

export const actions = {
	onUpdateItem:
		(id: string, data: DatasourceDataResponseItem): Action<State, void, void> =>
		({ setState, getState }) => {
			const oldItems = { ...getState().items };
			const oldItem = oldItems[id];
			if (!oldItem) {
				return;
			}
			setState({
				items: {
					...oldItems,
					[id]: {
						...oldItem,
						data: {
							...data,
							ari: oldItem.data.ari,
						},
					},
				},
			});
		},
	onAddItems:
		(
			items: DatasourceDataResponseItem[],
			integrationKey: string | undefined,
		): Action<State, void, string[]> =>
		({ setState, getState }) => {
			const oldItems = { ...getState().items };
			const [newItemIds, newItems] = items.reduce<[Array<string>, State['items']]>(
				([ids, itemMap], item) => {
					const ari = typeof item['ari']?.data === 'string' ? item['ari'].data : undefined;
					const id = ari ?? uuidv4();

					return [
						[...ids, id],
						{
							...itemMap,
							[id]: {
								ari,
								integrationKey,
								data: {
									...oldItems[id]?.data,
									...item,
								},
							},
						},
					];
				},
				[[], oldItems],
			);

			setState({
				items: newItems,
			});

			return newItemIds;
		},
};

export const Store = createStore<State, Actions>({
	name: 'datasource-store',
	initialState: getInitialState(),
	actions,
});

export const useDatasourceItem = createStateHook<
	State,
	Actions,
	DatasourceItem | undefined,
	{ id: string }
>(Store, {
	selector: (state, { id }) => state.items[id],
});

export const useDatasourceActions = createActionsHook(Store);

const Container = createContainer(Store);

export const StoreContainer = ({ children }: { children: JSX.Element }) => {
	if (fg('enable_datasource_react_sweet_state')) {
		return <Container scope="datasource">{children}</Container>;
	}
	return children;
};
