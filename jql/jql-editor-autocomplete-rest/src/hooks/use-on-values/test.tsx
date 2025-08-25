import React, { type ReducerState, useReducer, useRef } from 'react';

import { render } from '@testing-library/react';
import noop from 'lodash/noop';
import { act } from 'react-dom/test-utils';
import { DiProvider, injectable } from 'react-magnetic-di';
import { from } from 'rxjs/observable/from';

import { type AutocompleteOptions } from '@atlaskit/jql-editor-common';

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
import { getAutocompleteSuggestionsUrl } from '../use-fetch-field-values';

import useOnValues, { type FieldValuesReducer } from './index';

// @ts-ignore
jest.mock('rxjs/operators/delay', () => ({ delay: jest.fn(() => (s) => s) }));

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

const mockGetSuggestions = jest.fn<Promise<AutocompleteSuggestionsResponse>, [string]>();

const mapToAutocompleteOptions = (data: JQLFieldValueResponse[]): AutocompleteOptions =>
	data.map((item) => {
		return {
			name: item.displayName,
			value: item.value,
		};
	});

describe('onValues', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const onNext = jest.fn();

	type OnValuesConsumerProps = {
		done: jest.DoneCallback;
		field?: string;
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
		done,
	}: OnValuesConsumerProps) => {
		mockGetSuggestions.mockResolvedValue({ results: jqlFieldValues });

		const onValues = useOnValues(from(jqlSearchableFields), mockGetSuggestions, noop);
		const values = useRef<AutocompleteOptions>([]);

		onValues(query, field).subscribe({
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
});
