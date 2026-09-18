import { JastBuilder } from '@atlaskit/jql-ast/jast-builder';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { constructFieldWithProperty } from './constructFieldWithProperty';
import { constructFieldWithPropertyFG } from './constructFieldWithPropertyFG';

/**
 * Builds the AST for the given JQL and returns the field node of the first terminal clause.
 */
const getFirstClauseField = (jql: string) => {
	const ast = new JastBuilder().build(jql);
	const clause = ast.query?.where;

	if (!clause || clause.clauseType !== 'terminal') {
		throw new Error(`Expected a single terminal clause for JQL: ${jql}`);
	}

	return clause.field;
};

describe('constructFieldWithProperty', () => {
	it('returns the field value unchanged for a plain field', () => {
		expect(constructFieldWithProperty(getFirstClauseField('assignee = jsmith'))).toBe('assignee');
	});

	it('reconstructs the identity for an unquoted field with an entity property', () => {
		// Parsed unquoted, the property is split out of `field.value` into `field.properties`.
		expect(constructFieldWithProperty(getFirstClauseField('agentSessions[agent] = a'))).toBe(
			'agentSessions[agent]',
		);
		expect(
			constructFieldWithProperty(getFirstClauseField('agentSessions[stateCategory] = a')),
		).toBe('agentSessions[stateCategory]');
	});

	it('leaves quoted collapsed fields unchanged (brackets stay part of the value)', () => {
		// Quoted, the whole term is the field value and there are no separate properties.
		expect(constructFieldWithProperty(getFirstClauseField('"Team[team]" = a'))).toBe('Team[team]');
		expect(constructFieldWithProperty(getFirstClauseField('"cf[10020]" = a'))).toBe('cf[10020]');
	});
});

describe('constructFieldWithPropertyFG', () => {
	it('reconstructs the identity when the experiment is enabled', () => {
		mockExpEnabled('jira_filter_by_agent_and_agent_state');

		expect(constructFieldWithPropertyFG(getFirstClauseField('agentSessions[agent] = a'))).toBe(
			'agentSessions[agent]',
		);
	});

	it('falls back to the raw field value when the experiment is disabled', () => {
		mockExpDisabled('jira_filter_by_agent_and_agent_state');

		// Property is split off `field.value`, so the raw value is just the base name.
		expect(constructFieldWithPropertyFG(getFirstClauseField('agentSessions[agent] = a'))).toBe(
			'agentSessions',
		);
	});
});
