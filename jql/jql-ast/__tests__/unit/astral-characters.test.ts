import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { JastBuilder } from '../../src';

// 🟡 is a single code point but two UTF-16 code units. AST positions are applied to the editor
// text, which is indexed in UTF-16 code units.
const query = '"Event Type" = "🟡 Template" AND status = Done';

describe('JastBuilder with astral characters', () => {
	beforeEach(() => {
		passGate('filter_jql_jracloud-100041');
	});

	it('returns positions that match the text after an emoji', () => {
		const where = new JastBuilder().build(query).query?.where;
		const clause = where && 'clauses' in where ? where.clauses[1] : undefined;
		const position = clause && 'field' in clause ? clause.field.position : undefined;

		expect(position).toEqual([query.indexOf('status'), query.indexOf('status') + 'status'.length]);
	});
});
