/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import { JastBuilder } from '../../src';

const builder = new JastBuilder();

export const assertValid = (queries: string[]): void => {
	queries.forEach((query) => {
		it(`🟩 ${query}`, () => {
			const ast = builder.build(query);
			expect(ast.errors).toHaveLength(0);
			expect(ast).toMatchSnapshot();
		});
	});
};

export const assertInvalid = (queries: string[]): void => {
	queries.forEach((query) => {
		it(`🟥 ${query}`, () => {
			const ast = builder.build(query);
			expect(ast.errors).not.toHaveLength(0);
			expect(ast).toMatchSnapshot();
		});
	});
};
