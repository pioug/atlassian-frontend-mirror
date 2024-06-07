import React, { type ReactNode, useMemo, useReducer } from 'react';

import { createPortal } from 'react-dom';

import { type PluginContainerKey } from '../../plugins/types';

import { PortalActionsContext } from './context';
import { type Container, type PortalAction, type PortalActions, type PortalState } from './types';

const initialState: PortalState = {
	components: {},
	containers: {},
};

const reducer = (state: PortalState, action: PortalAction) => {
	switch (action.type) {
		case 'createPortal': {
			const { key, portalComponent, container } = action.payload;
			return {
				...state,
				components: {
					...state.components,
					[key]: {
						portalComponent,
						container,
					},
				},
			};
		}
		case 'destroyPortal': {
			const { [action.payload]: toDestroy, ...components } = state.components;
			return {
				...state,
				components,
			};
		}
		case 'registerPluginContainer': {
			const { element, containerKey } = action.payload;
			if (!element) {
				return state;
			}
			return {
				...state,
				containers: {
					...state.containers,
					[containerKey]: element,
				},
			};
		}
		default: {
			return state;
		}
	}
};

/**
 * Provides actions to manage portals via context and renders portalled components into the React tree.
 */
export const JQLEditorPortalRenderer = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const actionsContext = useMemo<PortalActions>(() => {
		return {
			onCreatePortal: (key: string, portalComponent: ReactNode, container: Container) =>
				dispatch({
					type: 'createPortal',
					payload: {
						key,
						portalComponent,
						container,
					},
				}),
			onDestroyPortal: (key: string) => dispatch({ type: 'destroyPortal', payload: key }),
			onRegisterPluginContainer: (containerKey: PluginContainerKey, element: HTMLElement | null) =>
				dispatch({
					type: 'registerPluginContainer',
					payload: {
						containerKey,
						element,
					},
				}),
		};
	}, [dispatch]);

	return (
		<PortalActionsContext.Provider value={actionsContext}>
			{children}
			{Object.entries(state.components).map(([key, value]) => {
				const container =
					value.container instanceof Element ? value.container : state.containers[value.container];
				return container !== undefined ? createPortal(value.portalComponent, container, key) : null;
			})}
		</PortalActionsContext.Provider>
	);
};
