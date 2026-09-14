import React, { useRef } from 'react';

// eslint-disable-next-line @atlassian/testing-library/prefer-atlassian-testing-library
import { render } from '@testing-library/react';
import { of } from 'rxjs/observable/of';

import type { AutocompleteOptions } from '@atlaskit/jql-editor-common/autocomplete/types';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import {
	accountJqlField,
	accountManagerJqlField,
	assigneeJqlField,
	collapsedCustomField,
	componentJqlField,
	currentUserFunction,
	doubleQuotedJqlField,
	forgeJqlFunction,
	inactiveUsersFunction,
	membersOfFunction,
	nonAutocompletableField,
	nonOrderableJqlField,
	singleQuotedJqlField,
	statusJqlField,
	updatedByFunction,
} from '../../common/mocks';
import { type JQLFieldResponse, type JQLFunctionResponse } from '../../common/types';

import useOnFunctions from './index';

const agentSessionsAgentApplicationUserField: JQLFieldResponse = {
	auto: 'true',
	displayName: 'AgentSessions - agentSessions[agent]',
	operators: ['=', '!=', 'in', 'not in', 'is', 'is not'],
	searchable: 'true',
	types: ['com.atlassian.jira.user.ApplicationUser'],
	value: 'agentSessions[agent]',
};

const mockJqlSearchableFields: JQLFieldResponse[] = [
	accountJqlField,
	accountManagerJqlField,
	agentSessionsAgentApplicationUserField,
	assigneeJqlField,
	componentJqlField,
	doubleQuotedJqlField,
	singleQuotedJqlField,
	statusJqlField,
	nonOrderableJqlField,
	nonAutocompletableField,
	collapsedCustomField,
];

const mockJqlFunctions: JQLFunctionResponse[] = [
	currentUserFunction,
	membersOfFunction,
	updatedByFunction,
	inactiveUsersFunction,
	forgeJqlFunction,
];

const mapToAutocompleteOptions = (data: JQLFunctionResponse[]): AutocompleteOptions =>
	data.map((item) => {
		return {
			name: item.displayName,
			value: item.value,
			isListFunction: item.isList === 'true' || item.supportsListAndSingleValueOperators === 'true',
		};
	});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('onFunctions', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const onNext = jest.fn();

	type OnFunctionsConsumerProps = {
		done: jest.DoneCallback;
		field?: string;
		isListOperator?: boolean;
		jqlFunctions: JQLFunctionResponse[];
		jqlSearchableFields: JQLFieldResponse[];
		onAssert: (fields: AutocompleteOptions) => void;
		query?: string;
	};

	const OnFunctionsConsumer = ({
		jqlSearchableFields,
		jqlFunctions,
		onAssert,
		field,
		query,
		isListOperator,
		done,
	}: OnFunctionsConsumerProps) => {
		const onFunctions = useOnFunctions(of(...jqlSearchableFields), of(...jqlFunctions));
		const functions = useRef<AutocompleteOptions>([]);

		onFunctions(query, field, isListOperator).subscribe({
			next: (data) => {
				onNext();
				functions.current = data;
			},
			complete: () => {
				try {
					onAssert(functions.current);
					done();
				} catch (e) {
					done(e);
				}
			},
		});

		return null;
	};

	it('returns functions if field does not support autocomplete', (done) => {
		const field = nonAutocompletableField.value;
		const assertFunctions = (functions: AutocompleteOptions) => {
			const expectedFunctions = mapToAutocompleteOptions([
				currentUserFunction,
				membersOfFunction,
				forgeJqlFunction,
			]);
			expect(functions).toEqual(expectedFunctions);
		};

		render(
			<OnFunctionsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				jqlFunctions={mockJqlFunctions}
				field={field}
				onAssert={assertFunctions}
				done={done}
			/>,
		);
	});

	it('returns functions for a JQL field with a matching type', (done) => {
		const field = 'assignee';
		const assertFunctions = (functions: AutocompleteOptions) => {
			const expectedFunctions = mapToAutocompleteOptions([
				currentUserFunction,
				membersOfFunction,
				forgeJqlFunction,
			]);
			expect(functions).toEqual(expectedFunctions);
		};

		render(
			<OnFunctionsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				jqlFunctions={mockJqlFunctions}
				field={field}
				onAssert={assertFunctions}
				done={done}
			/>,
		);
	});

	it('returns functions for a JQL field with a matching type that starts with the provided query', (done) => {
		const field = 'assignee';
		const query = 'mem';
		const assertFunctions = (functions: AutocompleteOptions) => {
			const expectedFunctions = mapToAutocompleteOptions([membersOfFunction]);
			expect(functions).toEqual(expectedFunctions);
		};

		render(
			<OnFunctionsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				jqlFunctions={mockJqlFunctions}
				field={field}
				query={query}
				onAssert={assertFunctions}
				done={done}
			/>,
		);
	});

	it('returns both list and non-list functions if a list operator is used', (done) => {
		const field = 'assignee';
		const query = '';
		const isListOperator = true;
		const assertFunctions = (functions: AutocompleteOptions) => {
			const expectedFunctions = mapToAutocompleteOptions([
				currentUserFunction,
				membersOfFunction,
				inactiveUsersFunction,
				forgeJqlFunction,
			]);
			expect(functions).toEqual(expectedFunctions);
		};

		render(
			<OnFunctionsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				jqlFunctions={mockJqlFunctions}
				field={field}
				query={query}
				isListOperator={isListOperator}
				onAssert={assertFunctions}
				done={done}
			/>,
		);
	});

	it('only returns single value functions if a list operator is not used', (done) => {
		const field = 'assignee';
		const query = '';
		const isListOperator = false;
		const assertFunctions = (functions: AutocompleteOptions) => {
			const expectedFunctions = mapToAutocompleteOptions([
				currentUserFunction,
				membersOfFunction,
				forgeJqlFunction,
			]);
			expect(functions).toEqual(expectedFunctions);
		};

		render(
			<OnFunctionsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				jqlFunctions={mockJqlFunctions}
				field={field}
				query={query}
				isListOperator={isListOperator}
				onAssert={assertFunctions}
				done={done}
			/>,
		);
	});

	it('returns no functions for agentSessions[agent] when the experiment is enabled', (done) => {
		mockExpEnabled('jira_filter_by_agent_and_agent_state');
		const field = 'agentSessions[agent]';
		const assertFunctions = (functions: AutocompleteOptions) => {
			expect(functions).toEqual([]);
		};

		render(
			<OnFunctionsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				jqlFunctions={mockJqlFunctions}
				field={field}
				onAssert={assertFunctions}
				done={done}
			/>,
		);
	});
});
