import React, { type ReducerState, useReducer, useRef } from 'react';

import { render } from '@testing-library/react';
import noop from 'lodash/noop';
import { act } from 'react-dom/test-utils';
import { DiProvider, injectable } from 'react-magnetic-di';
import { from } from 'rxjs/observable/from';

import type { AutocompleteOptions } from '@atlaskit/jql-editor-common/autocomplete/types';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { type JqlEditorAutocompleteAnalyticsEvent } from '../../analytics/types';
import {
	accountJqlField,
	accountManagerJqlField,
	assigneeJqlField,
	collapsedCustomField,
	componentJqlField,
	doubleQuotedJqlField,
	fieldValuesMock,
	nonAutocompletableField,
	nonOrderableJqlField,
	nonSearchableJqlField,
	singleQuotedJqlField,
	statusJqlField,
} from '../../common/mocks';
import {
	type AutocompleteSuggestionsResponse,
	type JQLFieldResponse,
	type JQLFieldValueResponse,
} from '../../common/types';
import { getAutocompleteSuggestionsUrl } from '../use-fetch-field-values/getAutocompleteSuggestionsUrl';
import useOnValues, { type FieldValuesReducer } from './index';

// @ts-ignore
jest.mock('rxjs/operators/delay', () => ({ delay: jest.fn(() => (s) => s) }));

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

const mockJqlSearchableFields: JQLFieldResponse[] = [
	accountJqlField,
	accountManagerJqlField,
	assigneeJqlField,
	componentJqlField,
	doubleQuotedJqlField,
	singleQuotedJqlField,
	statusJqlField,
	nonOrderableJqlField,
	nonAutocompletableField,
	collapsedCustomField,
];

const assetsJqlField: JQLFieldResponse = {
	value: 'Assets',
	displayName: 'Assets - cf[10049]',
	cfid: 'cf[10049]',
	operators: ['=', '!=', 'in', 'not in', 'is', 'is not'],
	types: ['com.atlassian.servicedesk.cmdb.model.CmdbObjectReference'],
	searchable: 'true',
	orderable: 'true',
	auto: 'true',
};

const assetsFieldValuesMock: JQLFieldValueResponse[] = [
	{
		value: '"ari:cloud:cmdb::object/ac72f855-c692-441a-8557-bb958b38f698/10"',
		displayName: 'Object 1 - DT-10',
	},
];

const mockGetSuggestions = jest.fn<Promise<AutocompleteSuggestionsResponse>, [string]>();

const mapToAutocompleteOptions = (data: JQLFieldValueResponse[]): AutocompleteOptions =>
	data.map((item) => {
		return {
			name: item.displayName,
			value: item.value,
		};
	});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('onValues', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const onNext = jest.fn();

	type OnValuesConsumerProps = {
		createAndFireAnalyticsEvent?: (payload: JqlEditorAutocompleteAnalyticsEvent) => void;
		done: jest.DoneCallback;
		field?: string;
		functionName?: string;
		jqlFieldValues: JQLFieldValueResponse[];
		jqlSearchableFields: JQLFieldResponse[];
		onAssert: (fields: AutocompleteOptions) => void;
		query?: string;
	};

	const OnValuesConsumer = ({
		jqlSearchableFields,
		jqlFieldValues,
		onAssert,
		field,
		query,
		functionName,
		createAndFireAnalyticsEvent = noop,
		done,
	}: OnValuesConsumerProps) => {
		mockGetSuggestions.mockResolvedValue({ results: jqlFieldValues });

		const onValues = useOnValues(
			from(jqlSearchableFields),
			mockGetSuggestions,
			createAndFireAnalyticsEvent,
		);
		const values = useRef<AutocompleteOptions>([]);

		onValues(query, field, functionName).subscribe({
			next: (data) => {
				onNext();
				values.current = data;
			},
			complete: () => {
				try {
					onAssert(values.current);
					done();
				} catch (e) {
					done(e);
				}
			},
		});

		return null;
	};

	it('does not emit any events when no field is provided', (done) => {
		const assertValues = () => {
			expect(onNext).not.toHaveBeenCalled();
		};

		act(() => {
			render(
				<OnValuesConsumer
					jqlSearchableFields={mockJqlSearchableFields}
					jqlFieldValues={fieldValuesMock}
					onAssert={assertValues}
					done={done}
				/>,
			);
		});
	});

	it('returns no values when the provided field could not be found', (done) => {
		const field = 'somemissingfield';
		const assertValues = (values: AutocompleteOptions) => {
			expect(values).toEqual([]);
		};

		act(() => {
			render(
				<OnValuesConsumer
					jqlSearchableFields={mockJqlSearchableFields}
					jqlFieldValues={fieldValuesMock}
					field={field}
					onAssert={assertValues}
					done={done}
				/>,
			);
		});
	});

	it('returns no values if field is not searchable', (done) => {
		const field = nonSearchableJqlField.value;
		const assertValues = (values: AutocompleteOptions) => {
			expect(values).toEqual([]);
		};

		act(() => {
			render(
				<OnValuesConsumer
					jqlSearchableFields={mockJqlSearchableFields}
					jqlFieldValues={fieldValuesMock}
					field={field}
					onAssert={assertValues}
					done={done}
				/>,
			);
		});
	});

	it('returns no values if field does not support autocomplete', (done) => {
		const field = nonAutocompletableField.value;
		const assertValues = (values: AutocompleteOptions) => {
			expect(values).toEqual([]);
		};

		act(() => {
			render(
				<OnValuesConsumer
					jqlSearchableFields={mockJqlSearchableFields}
					jqlFieldValues={fieldValuesMock}
					field={field}
					onAssert={assertValues}
					done={done}
				/>,
			);
		});
	});

	it('calls getSuggestions using cfid when cfid is present in the matching field', (done) => {
		const field = 'account';
		const query = '';

		const assertFetchIsCalled = () => {
			expect(mockGetSuggestions).toHaveBeenCalledWith(
				getAutocompleteSuggestionsUrl(accountJqlField.cfid, ''),
			);
		};

		act(() => {
			render(
				<OnValuesConsumer
					jqlSearchableFields={mockJqlSearchableFields}
					jqlFieldValues={fieldValuesMock}
					field={field}
					query={query}
					onAssert={assertFetchIsCalled}
					done={done}
				/>,
			);
		});
	});

	it('calls getSuggestions using provided field when cfid is not present in the matching field', (done) => {
		const field = '"Collapsed[Dropdown]"';
		const query = '';

		const assertFetchIsCalled = () => {
			expect(mockGetSuggestions).toHaveBeenCalledWith(
				getAutocompleteSuggestionsUrl('Collapsed[Dropdown]', ''),
			);
		};

		act(() => {
			render(
				<OnValuesConsumer
					jqlSearchableFields={mockJqlSearchableFields}
					jqlFieldValues={fieldValuesMock}
					field={field}
					query={query}
					onAssert={assertFetchIsCalled}
					done={done}
				/>,
			);
		});
	});

	it('returns values from the cache when called with the same field and query', (done) => {
		const field = 'assignee';
		const query = '';
		const cachedOptions = mapToAutocompleteOptions(fieldValuesMock);
		const cacheMock: ReducerState<FieldValuesReducer> = {
			[`${field}:${query}`]: cachedOptions,
		};

		const useReducerMock = jest.fn(() => [cacheMock]);
		// @ts-ignore
		const deps = [injectable(useReducer, useReducerMock)];

		const assertFetchIsNotCalled = (values: AutocompleteOptions) => {
			expect(mockGetSuggestions).not.toHaveBeenCalled();
			expect(values).toEqual(cachedOptions);
		};

		act(() => {
			render(
				<OnValuesConsumer
					jqlSearchableFields={mockJqlSearchableFields}
					jqlFieldValues={fieldValuesMock}
					field={field}
					query={query}
					onAssert={assertFetchIsNotCalled}
					done={done}
				/>,
				{
					wrapper: (p) => <DiProvider use={deps} {...p} />,
				},
			);
		});
	});

	it('emits the enclosing functionName on the autocompleteSuggestions event when values back a function argument', (done) => {
		const createAndFireAnalyticsEvent = jest.fn();
		const field = 'account';
		const query = '';

		const assertFunctionNameEmitted = () => {
			expect(createAndFireAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'success',
					actionSubject: 'autocompleteSuggestions',
					attributes: { functionName: 'descendantsofteam' },
				}),
			);
		};

		act(() => {
			render(
				<OnValuesConsumer
					jqlSearchableFields={mockJqlSearchableFields}
					jqlFieldValues={fieldValuesMock}
					field={field}
					query={query}
					functionName="descendantsofteam"
					createAndFireAnalyticsEvent={createAndFireAnalyticsEvent}
					onAssert={assertFunctionNameEmitted}
					done={done}
				/>,
			);
		});
	});

	it('omits functionName from the autocompleteSuggestions event for ordinary field-value autocomplete', (done) => {
		const createAndFireAnalyticsEvent = jest.fn();
		const field = 'account';
		const query = '';

		const assertNoFunctionName = () => {
			expect(createAndFireAnalyticsEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'success',
					actionSubject: 'autocompleteSuggestions',
				}),
			);
			expect(createAndFireAnalyticsEvent).not.toHaveBeenCalledWith(
				expect.objectContaining({ attributes: expect.anything() }),
			);
		};

		act(() => {
			render(
				<OnValuesConsumer
					jqlSearchableFields={mockJqlSearchableFields}
					jqlFieldValues={fieldValuesMock}
					field={field}
					query={query}
					createAndFireAnalyticsEvent={createAndFireAnalyticsEvent}
					onAssert={assertNoFunctionName}
					done={done}
				/>,
			);
		});
	});

	describe('Assets object values', () => {
		it('are marked as assets so they render as a rich inline node when the gate is on', (done) => {
			passGate('orion-8274-cmdb-object-jql-values-resolver');

			const assertValues = (values: AutocompleteOptions) => {
				expect(values).toEqual([
					{
						name: 'Object 1 - DT-10',
						value: '"ari:cloud:cmdb::object/ac72f855-c692-441a-8557-bb958b38f698/10"',
						valueType: 'assets',
					},
				]);
			};

			act(() => {
				render(
					<OnValuesConsumer
						jqlSearchableFields={[...mockJqlSearchableFields, assetsJqlField]}
						jqlFieldValues={assetsFieldValuesMock}
						field="Assets"
						onAssert={assertValues}
						done={done}
					/>,
				);
			});
		});

		it('are left as plain text when the gate is off', (done) => {
			failGate('orion-8274-cmdb-object-jql-values-resolver');

			const assertValues = (values: AutocompleteOptions) => {
				expect(values).toEqual([
					{
						name: 'Object 1 - DT-10',
						value: '"ari:cloud:cmdb::object/ac72f855-c692-441a-8557-bb958b38f698/10"',
					},
				]);
			};

			act(() => {
				render(
					<OnValuesConsumer
						jqlSearchableFields={[...mockJqlSearchableFields, assetsJqlField]}
						jqlFieldValues={assetsFieldValuesMock}
						field="Assets"
						onAssert={assertValues}
						done={done}
					/>,
				);
			});
		});
	});
});
