import React, { useEffect } from 'react';

import { render } from '@testing-library/react';
import noop from 'lodash/noop';
import { createContainer } from 'react-sweet-state';

import { jqlFieldsString, jqlFunctionsString } from '../common/mocks';
import {
	type AutocompleteInitialDataResponse,
	type JQLFieldResponse,
	type JQLFunctionResponse,
} from '../common/types';

import { type Actions, type Store } from './types';

import {
	actions,
	store,
	useJqlAutocompleteActions,
	useJqlFunctionsObservable,
	useJqlOrderableFieldsObservable,
	useJqlSearchableFieldsObservable,
} from './index';

const mockGetInitialData = jest.fn<Promise<AutocompleteInitialDataResponse>, [string]>();

// Load initial data onInit
const JQLAutocompleteContainer = createContainer<Store, Actions>(store, {
	onInit:
		() =>
		({ dispatch }) => {
			dispatch(actions.load(mockGetInitialData, noop));
		},
});

describe('Sweet state', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('load action', () => {
		it('only calls fetch once when the action is dispatched multiple times', (done) => {
			const response: AutocompleteInitialDataResponse = {
				jqlFields: [],
				jqlFunctions: [],
			};
			mockGetInitialData.mockImplementation(() => Promise.resolve(response));

			const Consumer = () => {
				const [, { load }] = useJqlAutocompleteActions();

				useEffect(() => {
					try {
						// Should be called once on init of the container
						expect(mockGetInitialData).toHaveBeenCalledTimes(1);
						load(mockGetInitialData, noop);
						expect(mockGetInitialData).toHaveBeenCalledTimes(1);
						done();
					} catch (e) {
						done(e);
					}
				}, [load]);
				return null;
			};
			render(
				<JQLAutocompleteContainer>
					<Consumer />
				</JQLAutocompleteContainer>,
			);
		});
	});

	describe('useJqlSearchableFieldsObservable', () => {
		it('emits a complete event with no fields when the promise is rejected', (done) => {
			mockGetInitialData.mockImplementation(() => Promise.reject());
			const Consumer = () => {
				const [jqlSearchableFields$] = useJqlSearchableFieldsObservable();

				useEffect(() => {
					const nextMock = jest.fn();
					jqlSearchableFields$.subscribe({
						next: () => nextMock(),
						complete: () => {
							try {
								expect(nextMock).not.toHaveBeenCalled();
								done();
							} catch (e) {
								done(e);
							}
						},
					});
					// We intentionally exclude jqlSearchableFields$ as a dependency because we only want the subscribe
					// assertion to be run once!
					// eslint-disable-next-line react-hooks/exhaustive-deps
				}, []);

				return null;
			};

			render(
				<JQLAutocompleteContainer>
					<Consumer />
				</JQLAutocompleteContainer>,
			);
		});
		it('emits each JQL field when the promise is resolved', (done) => {
			const jqlFields: JQLFieldResponse[] = JSON.parse(jqlFieldsString);
			const jqlSearchableFields = jqlFields.filter(({ searchable }) => searchable === 'true');
			const response: AutocompleteInitialDataResponse = {
				jqlFields,
				jqlFunctions: [],
			};
			mockGetInitialData.mockImplementation(() => Promise.resolve(response));

			const Consumer = () => {
				const [jqlSearchableFields$] = useJqlSearchableFieldsObservable();

				useEffect(() => {
					// Track each incoming value from our observable to assert that all fields are consumed
					const trackedValues: JQLFieldResponse[] = [];
					jqlSearchableFields$.subscribe({
						next: (value) => trackedValues.push(value),
						complete: () => {
							try {
								expect(trackedValues).toEqual(jqlSearchableFields);
								done();
							} catch (e) {
								done(e);
							}
						},
					});
					// We intentionally exclude jqlSearchableFields$ as a dependency because we only want the subscribe
					// assertion to be run once!
					// eslint-disable-next-line react-hooks/exhaustive-deps
				}, []);

				return null;
			};

			render(
				<JQLAutocompleteContainer>
					<Consumer />
				</JQLAutocompleteContainer>,
			);
		});
	});

	describe('useJqlOrderableFieldsObservable', () => {
		it('emits a complete event with no fields when the promise is rejected', (done) => {
			mockGetInitialData.mockImplementation(() => Promise.reject());
			const Consumer = () => {
				const [jqlOrderableFields$] = useJqlOrderableFieldsObservable();

				useEffect(() => {
					const nextMock = jest.fn();
					jqlOrderableFields$.subscribe({
						next: () => nextMock(),
						complete: () => {
							try {
								expect(nextMock).not.toHaveBeenCalled();
								done();
							} catch (e) {
								done(e);
							}
						},
					});
					// We intentionally exclude jqlOrderableFields$ as a dependency because we only want the subscribe
					// assertion to be run once!
					// eslint-disable-next-line react-hooks/exhaustive-deps
				}, []);

				return null;
			};

			render(
				<JQLAutocompleteContainer>
					<Consumer />
				</JQLAutocompleteContainer>,
			);
		});
		it('emits each JQL field when the promise is resolved', (done) => {
			const jqlFields: JQLFieldResponse[] = JSON.parse(jqlFieldsString);
			const jqlOrderableFields = jqlFields.filter(({ orderable }) => orderable === 'true');
			const response: AutocompleteInitialDataResponse = {
				jqlFields,
				jqlFunctions: [],
			};
			mockGetInitialData.mockImplementation(() => Promise.resolve(response));

			const Consumer = () => {
				const [jqlOrderableFields$] = useJqlOrderableFieldsObservable();

				useEffect(() => {
					// Track each incoming value from our observable to assert that all fields are consumed
					const trackedValues: JQLFieldResponse[] = [];
					jqlOrderableFields$.subscribe({
						next: (value) => trackedValues.push(value),
						complete: () => {
							try {
								expect(trackedValues).toEqual(jqlOrderableFields);
								done();
							} catch (e) {
								done(e);
							}
						},
					});
					// We intentionally exclude jqlOrderableFields$ as a dependency because we only want the subscribe
					// assertion to be run once!
					// eslint-disable-next-line react-hooks/exhaustive-deps
				}, []);

				return null;
			};

			render(
				<JQLAutocompleteContainer>
					<Consumer />
				</JQLAutocompleteContainer>,
			);
		});
	});

	describe('useJqlFunctionsObservable', () => {
		it('emits a complete event with no fields when the promise is rejected', (done) => {
			mockGetInitialData.mockImplementation(() => Promise.reject());
			const Consumer = () => {
				const [jqlFunctions$] = useJqlFunctionsObservable();

				useEffect(() => {
					const nextMock = jest.fn();
					jqlFunctions$.subscribe({
						next: () => nextMock(),
						complete: () => {
							try {
								expect(nextMock).not.toHaveBeenCalled();
								done();
							} catch (e) {
								done(e);
							}
						},
					});
					// We intentionally exclude jqlFunctions$ as a dependency because we only want the subscribe
					// assertion to be run once!
					// eslint-disable-next-line react-hooks/exhaustive-deps
				}, []);

				return null;
			};

			render(
				<JQLAutocompleteContainer>
					<Consumer />
				</JQLAutocompleteContainer>,
			);
		});
		it('emits each JQL field when the promise is resolved', (done) => {
			const jqlFunctions: JQLFunctionResponse[] = JSON.parse(jqlFunctionsString);
			const response: AutocompleteInitialDataResponse = {
				jqlFields: [],
				jqlFunctions,
			};
			mockGetInitialData.mockImplementation(() => Promise.resolve(response));

			const Consumer = () => {
				const [jqlFunctions$] = useJqlFunctionsObservable();

				useEffect(() => {
					// Track each incoming value from our observable to assert that all functions are consumed
					const trackedValues: JQLFunctionResponse[] = [];
					jqlFunctions$.subscribe({
						next: (value) => trackedValues.push(value),
						complete: () => {
							try {
								expect(trackedValues).toEqual(jqlFunctions);
								done();
							} catch (e) {
								done(e);
							}
						},
					});
					// We intentionally exclude jqlFunctions$ as a dependency because we only want the subscribe
					// assertion to be run once!
					// eslint-disable-next-line react-hooks/exhaustive-deps
				}, []);

				return null;
			};

			render(
				<JQLAutocompleteContainer>
					<Consumer />
				</JQLAutocompleteContainer>,
			);
		});
	});
});
