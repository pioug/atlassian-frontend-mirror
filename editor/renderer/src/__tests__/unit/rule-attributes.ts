import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { renderDocument } from '../../render-document';

const attributes = { color: '#FF5630', style: 'dashed', weight: 3 };

const getRenderedRules = (content: ADFEntity[], stage: 'stage0' | 'final' = 'stage0') => {
	const { pmDoc } = renderDocument(
		{ version: 1, type: 'doc', content },
		{ serializeFragment: () => null },
		getSchemaBasedOnStage(stage),
		stage,
	);
	const rules: PMNode[] = [];
	pmDoc?.descendants((node) => {
		if (node.type.name === 'rule') {
			rules.push(node);
		}
	});
	return rules;
};

describe('rule with attributes', () => {
	it('preserves color, style, and weight for rules in the document root', () => {
		const content = [{ type: 'rule', attrs: attributes }];

		const rules = getRenderedRules(content);

		expect(rules).toHaveLength(1);
		expect(rules[0].attrs).toEqual(expect.objectContaining(attributes));
		expect(rules[0].marks.map((mark) => mark.type.name)).not.toContain('unsupportedNodeAttribute');
	});

	it('preserves color, style, and weight for rules in a table cell', () => {
		const content = [
			{
				type: 'table',
				content: [
					{
						type: 'tableRow',
						content: [{ type: 'tableCell', content: [{ type: 'rule', attrs: attributes }] }],
					},
				],
			},
		];

		const rules = getRenderedRules(content);

		expect(rules).toHaveLength(1);
		expect(rules[0].attrs).toEqual(expect.objectContaining(attributes));
		expect(rules[0].marks.map((mark) => mark.type.name)).not.toContain('unsupportedNodeAttribute');
	});

	it('preserves color, style, and weight for rules in a table header', () => {
		const content = [
			{
				type: 'table',
				content: [
					{
						type: 'tableRow',
						content: [{ type: 'tableHeader', content: [{ type: 'rule', attrs: attributes }] }],
					},
				],
			},
		];

		const rules = getRenderedRules(content);

		expect(rules).toHaveLength(1);
		expect(rules[0].attrs).toEqual(expect.objectContaining(attributes));
		expect(rules[0].marks.map((mark) => mark.type.name)).not.toContain('unsupportedNodeAttribute');
	});

	it('removes stage-0 attributes from rules in the full schema', () => {
		const content = [{ type: 'rule', attrs: attributes }];

		const rules = getRenderedRules(content, 'final');

		expect(rules).toHaveLength(1);
		expect(rules[0].attrs).not.toHaveProperty('color');
		expect(rules[0].attrs).not.toHaveProperty('style');
		expect(rules[0].attrs).not.toHaveProperty('weight');
		expect(rules[0].marks.map((mark) => mark.type.name)).toContain('unsupportedNodeAttribute');
	});
});
