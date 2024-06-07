import React, { useRef } from 'react';

import { render } from '@testing-library/react';
import { from } from 'rxjs/observable/from';

import { type AutocompleteOptions } from '@atlaskit/jql-editor-common';

import {
	accountJqlField,
	accountManagerJqlField,
	assigneeJqlField,
	collapsedCustomField,
	componentJqlField,
	doubleQuotedJqlField,
	nonAutocompletableField,
	nonOrderableJqlField,
	singleQuotedJqlField,
	statusJqlField,
} from '../../common/mocks';
import { type JQLFieldResponse } from '../../common/types';

import useOnOperators from './index';

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

const mapOperatorToAutocompleteOptions = (data: string[]) =>
	data.map((item) => {
		const value = item.toUpperCase();
		return {
			name: value,
			value,
		};
	});

describe('onOperators', () => {
	const onNext = jest.fn();

	type OnOperatorsConsumerProps = {
		jqlSearchableFields: JQLFieldResponse[];
		field?: string;
		query?: string;
		done: jest.DoneCallback;
		onAssert: (fields: AutocompleteOptions) => void;
	};

	const OnOperatorsConsumer = ({
		jqlSearchableFields,
		onAssert,
		field,
		query,
		done,
	}: OnOperatorsConsumerProps) => {
		const onOperators = useOnOperators(from(jqlSearchableFields));
		const operators = useRef<AutocompleteOptions>([]);

		onOperators(query, field).subscribe({
			next: (data) => {
				onNext();
				operators.current = data;
			},
			complete: () => {
				try {
					onAssert(operators.current);
					done();
				} catch (e) {
					done(e);
				}
			},
		});

		return null;
	};

	it('does not emit any events when no field is provided', (done) => {
		const assertOperators = () => {
			expect(onNext).not.toHaveBeenCalled();
		};

		render(
			<OnOperatorsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertOperators}
				done={done}
			/>,
		);
	});
	it('does not emit any events when the provided field could not be found', (done) => {
		const field = 'somemissingfield';
		const assertOperators = () => {
			expect(onNext).not.toHaveBeenCalled();
		};

		render(
			<OnOperatorsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				field={field}
				onAssert={assertOperators}
				done={done}
			/>,
		);
	});
	it('returns all operators for a JQL field when no query is provided', (done) => {
		const field = 'status';
		const assertOperators = (operators: AutocompleteOptions) => {
			const expectedOperators = mapOperatorToAutocompleteOptions(statusJqlField.operators);
			expect(operators).toEqual(expectedOperators);
		};

		render(
			<OnOperatorsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				field={field}
				onAssert={assertOperators}
				done={done}
			/>,
		);
	});
	it('returns operators for a JQL field that start with the provided query', (done) => {
		const field = 'status';
		const query = 'wa';
		const assertOperators = (operators: AutocompleteOptions) => {
			const expectedOperators = mapOperatorToAutocompleteOptions([
				'was in',
				'was not in',
				'was',
				'was not',
			]);
			expect(operators).toEqual(expectedOperators);
		};

		render(
			<OnOperatorsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				query={query}
				field={field}
				onAssert={assertOperators}
				done={done}
			/>,
		);
	});
});
