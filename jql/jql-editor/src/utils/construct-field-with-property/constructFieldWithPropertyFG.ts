import { type Field } from '@atlaskit/jql-ast/field';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';

import { constructFieldWithProperty } from './constructFieldWithProperty';

export const constructFieldWithPropertyFG = (field: Field): string =>
	expVal('jira_filter_by_agent_and_agent_state', 'isEnabled', false)
		? constructFieldWithProperty(field)
		: field.value;
