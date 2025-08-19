import { createHook, createStore, type StoreActionApi } from 'react-sweet-state';

type Product = 'Jira' | 'Confluence' | 'Loom' | 'WebLink';
type AcceptedProduct = Exclude<Product, 'WebLink'>;

type ContainerState = {
	isLoading: boolean;
	isCreated: boolean;
};

type State = {
	Jira: ContainerState;
	Confluence: ContainerState;
	Loom: ContainerState;
};

type StoreAction = StoreActionApi<State>;

const actions = {
	updateContainerLoading:
		(product: Product, isLoading: boolean) =>
		({ setState, getState }: StoreAction) => {
			const containers = getState();
			const current = containers[product as AcceptedProduct];
			if (current.isLoading === isLoading) {
				return;
			}
			setState({ ...containers, [product]: { ...current, isLoading } });
		},
	updateContainerCreated:
		(product: Product, isCreated: boolean) =>
		({ setState, getState }: StoreAction) => {
			const containers = getState();
			const current = containers[product as AcceptedProduct];
			if (current.isCreated === isCreated) {
				return;
			}
			setState({ ...containers, [product]: { ...current, isCreated } });
		},
};

type Actions = typeof actions;

const initialState: State = {
	Jira: { isLoading: false, isCreated: false },
	Confluence: { isLoading: false, isCreated: false },
	Loom: { isLoading: false, isCreated: false },
};

const store = createStore<State, Actions>({
	initialState,
	actions,
	name: 'CreateContainers',
});

/**
 * Custom hook for accessing and updating the state of container creation (Jira, Confluence, Loom).
 *
 * Provides state and actions for loading and creation status of each container type.
 *
 * @returns {object} State and actions for managing container creation.
 */
const useCreateContainers = createHook(store);

export { useCreateContainers };
