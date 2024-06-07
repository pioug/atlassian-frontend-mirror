import {
	type ContainerComponent,
	createContainer,
	createHook,
	createStore,
} from 'react-sweet-state';
import type { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { concatMap } from 'rxjs/operators/concatMap';

import { EventType } from '@atlaskit/jql-editor-common';

import { Action, ActionSubject } from '../analytics';
import { type JQLFieldResponse, type JQLFunctionResponse } from '../common/types';

import { type Actions, type Store } from './types';

const initialData = {
	jqlSearchableFields: [],
	jqlOrderableFields: [],
	jqlFunctions: [],
};

const initialState: Store = {
	initialDataFetched: false,
	jqlSearchableFields$: from(initialData.jqlSearchableFields),
	jqlOrderableFields$: from(initialData.jqlOrderableFields),
	jqlFunctions$: from(initialData.jqlFunctions),
};

export const actions: Actions = {
	load:
		(getInitialData, createAndFireAnalyticsEvent) =>
		({ getState, setState }) => {
			const { initialDataFetched } = getState();
			if (initialDataFetched) {
				return;
			}

			const promise = getInitialData(`/rest/api/latest/jql/autocompletedata`)
				.then((res) => {
					const initialValue: {
						jqlSearchableFields: JQLFieldResponse[];
						jqlOrderableFields: JQLFieldResponse[];
						jqlFunctions: JQLFunctionResponse[];
					} = {
						jqlSearchableFields: [],
						jqlOrderableFields: [],
						jqlFunctions: res.jqlFunctions,
					};

					const data = res.jqlFields.reduce((result, field) => {
						if (field.searchable === 'true') {
							result.jqlSearchableFields.push(field);
						}
						if (field.orderable === 'true') {
							result.jqlOrderableFields.push(field);
						}
						return result;
					}, initialValue);

					// Minor optimisation so consumers don't have to wait for the promise `then` function to be called
					// whenever we subscribe to the observable. (`then` runs async in the current thread loop)
					setState({
						jqlSearchableFields$: from(data.jqlSearchableFields),
						jqlOrderableFields$: from(data.jqlOrderableFields),
						jqlFunctions$: from(data.jqlFunctions),
					});

					createAndFireAnalyticsEvent({
						action: Action.SUCCESS,
						actionSubject: ActionSubject.AUTOCOMPLETE_INITIAL_DATA,
						eventType: EventType.OPERATIONAL,
					});

					return data;
				})
				.catch(() => {
					setState({
						jqlSearchableFields$: initialState.jqlSearchableFields$,
						jqlOrderableFields$: initialState.jqlOrderableFields$,
						jqlFunctions$: initialState.jqlFunctions$,
					});

					createAndFireAnalyticsEvent({
						action: Action.FAILED,
						actionSubject: ActionSubject.AUTOCOMPLETE_INITIAL_DATA,
						eventType: EventType.OPERATIONAL,
					});
					return initialData;
				});

			// Set the in-flight promise in state as an observable. This allows consumers to subscribe to our initial data
			// without worrying about race conditions with the API call.
			setState({
				initialDataFetched: true,
				jqlSearchableFields$: from(promise).pipe(
					concatMap(({ jqlSearchableFields }) => jqlSearchableFields),
				),
				jqlOrderableFields$: from(promise).pipe(
					concatMap(({ jqlOrderableFields }) => jqlOrderableFields),
				),
				jqlFunctions$: from(promise).pipe(concatMap(({ jqlFunctions }) => jqlFunctions)),
			});
		},
};

export const store = createStore<Store, Actions>({ initialState, actions });

/**
 * Exported to allow consumers to have multiple store instances with initial JQL data. Typically this is unnecessary as
 * initial autocomplete data can be shared across all JQL editor instances but this can be useful for storybook testing
 * if you want to mock different responses for each story.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const JQLAutocompleteContainer: ContainerComponent<{}> = createContainer<Store, Actions>(
	store,
);

export const useJqlAutocompleteActions = createHook<Store, Actions, void, void>(store, {
	selector: null,
});

export const useJqlSearchableFieldsObservable = createHook<
	Store,
	Actions,
	Observable<JQLFieldResponse>,
	void
>(store, {
	selector: ({ jqlSearchableFields$ }) => jqlSearchableFields$,
});

export const useJqlOrderableFieldsObservable = createHook<
	Store,
	Actions,
	Observable<JQLFieldResponse>,
	void
>(store, {
	selector: ({ jqlOrderableFields$ }) => jqlOrderableFields$,
});

export const useJqlFunctionsObservable = createHook<
	Store,
	Actions,
	Observable<JQLFunctionResponse>,
	void
>(store, {
	selector: ({ jqlFunctions$ }) => jqlFunctions$,
});
