import { JastBuilder } from '@atlaskit/jql-ast/jast-builder';
import type { Jast } from '@atlaskit/jql-ast/query';

export const isValidJql = (jql: string): boolean => {
	const jast: Jast = new JastBuilder().build(jql);
	return jast?.errors?.length === 0;
};
