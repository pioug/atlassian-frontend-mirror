import { useEffect } from 'react';

import { createHook, createStore, type StoreActionApi } from 'react-sweet-state';

type InjectedEventAttributes = { teamId?: string; consumer?: string };
type InjectedEventAttributeKey = keyof InjectedEventAttributes;

type PeopleTeamsAnalyticsSubcontextState = {
	eventAttributes?: InjectedEventAttributes;
};

const initialState = {
	eventAttributes: {},
};

const actions = {
	setEventAttributes:
		(eventAttributes?: Partial<InjectedEventAttributes>) =>
		({ setState, getState }: StoreActionApi<PeopleTeamsAnalyticsSubcontextState>) => {
			const existingEventAttributes = getState().eventAttributes;

			const newEventAttributes: InjectedEventAttributes = {
				...existingEventAttributes,
				...eventAttributes,
			};

			Object.keys(newEventAttributes).forEach((keyString) => {
				const key = keyString as InjectedEventAttributeKey;
				if (newEventAttributes[key] === undefined) {
					delete newEventAttributes[key];
				}
			});

			setState({ eventAttributes: newEventAttributes });
		},
} as const;

type Actions = typeof actions;

const AnalyticsSubcontextStore = createStore<PeopleTeamsAnalyticsSubcontextState, Actions>({
	initialState,
	actions,
});

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const usePeopleTeamsAnalyticsSubcontext = createHook(AnalyticsSubcontextStore);

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 *
 * Inject an attribute into all events using `usePeopleTeamAnalyticsEvents`
 * It sets the attribute when the hook is called and clears it when the component is unmounted
 */
export const useInjectedEventAttribute = <K extends InjectedEventAttributeKey>(
	key: K,
	value: InjectedEventAttributes[K],
): void => {
	const { setEventAttributes } = usePeopleTeamsAnalyticsSubcontext()[1];

	useEffect(() => {
		setEventAttributes({ [key]: value });
		return () => setEventAttributes({ [key]: undefined });
	}, [key, value, setEventAttributes]);
};
