import type { EditorPlugin } from '@atlaskit/editor-common/types';
import { Schema } from '@atlaskit/editor-prosemirror/model';

import { filterPluginsForReconfigure } from '../../filter-plugins-for-reconfigure';

const minimalSchema = new Schema({
	nodes: {
		doc: { content: 'paragraph+' },
		paragraph: { content: 'text*' },
		text: {},
	},
});

const richSchema = new Schema({
	nodes: {
		doc: { content: 'paragraph+' },
		paragraph: { content: 'inline*' },
		text: { group: 'inline' },
		mention: { group: 'inline', inline: true, attrs: { id: {} } },
		blockCard: { attrs: { url: {} } },
	},
	marks: {
		strong: {},
	},
});

const plugin = (
	name: string,
	overrides: Partial<EditorPlugin> = {},
): EditorPlugin =>
	({
		name,
		...overrides,
	}) as unknown as EditorPlugin;

const nodes = (...names: string[]) => () => names.map((name) => ({ name, node: {} as any }));
const marks = (...names: string[]) => () => names.map((name) => ({ name, mark: {} as any }));

describe('filterPluginsForReconfigure', () => {
	it('keeps plugins whose nodes and marks are present in the schema', () => {
		const mention = plugin('mention', { nodes: nodes('mention') });
		const strong = plugin('strong', { marks: marks('strong') });

		const { kept, dropped } = filterPluginsForReconfigure([mention, strong], richSchema, new Set());

		expect(kept.map((p) => p.name)).toEqual(['mention', 'strong']);
		expect(dropped).toEqual([]);
	});

	it('drops a newly-added plugin whose nodes are missing from the schema, with reasons', () => {
		const mention = plugin('mention', { nodes: nodes('mention') });

		const { kept, dropped } = filterPluginsForReconfigure([mention], minimalSchema, new Set());

		expect(kept).toEqual([]);
		expect(dropped).toEqual([{ name: 'mention', missingNodes: ['mention'], missingMarks: [] }]);
	});

	it('drops a newly-added plugin whose marks are missing from the schema, with reasons', () => {
		const strong = plugin('strong', { marks: marks('strong') });

		const { kept, dropped } = filterPluginsForReconfigure([strong], minimalSchema, new Set());

		expect(kept).toEqual([]);
		expect(dropped).toEqual([{ name: 'strong', missingNodes: [], missingMarks: ['strong'] }]);
	});

	it('keeps a previously-registered plugin even if its nodes/marks are missing from the schema', () => {
		// Regression guard: tests sometimes mock a stripped-down schema that
		// happens to omit the nodes a long-lived plugin declares. Such a plugin
		// has demonstrably coexisted with the schema before this reconfigure,
		// so the schema check must NOT drop it.
		const card = plugin('card', { nodes: nodes('inlineCard', 'blockCard') });

		const { kept, dropped } = filterPluginsForReconfigure(
			[card],
			minimalSchema,
			new Set(['card']),
		);

		expect(kept.map((p) => p.name)).toEqual(['card']);
		expect(dropped).toEqual([]);
	});

	it('applies the schema check only to plugins NOT in the previous set', () => {
		const card = plugin('card', { nodes: nodes('inlineCard') }); // previously registered, missing nodes
		const mention = plugin('mention', { nodes: nodes('mention') }); // newly added, missing nodes

		const { kept, dropped } = filterPluginsForReconfigure(
			[card, mention],
			minimalSchema,
			new Set(['card']),
		);

		expect(kept.map((p) => p.name)).toEqual(['card']);
		expect(dropped.map((d) => d.name)).toEqual(['mention']);
	});

	it('drops nullish plugins silently (does not include them in dropped)', () => {
		const real = plugin('real');

		const { kept, dropped } = filterPluginsForReconfigure(
			[real, undefined, null],
			minimalSchema,
			new Set(),
		);

		expect(kept.map((p) => p.name)).toEqual(['real']);
		expect(dropped).toEqual([]);
	});

	it('reports both missing nodes and missing marks on a single dropped plugin', () => {
		const both = plugin('both', { nodes: nodes('mention'), marks: marks('strong') });

		const { kept, dropped } = filterPluginsForReconfigure([both], minimalSchema, new Set());

		expect(kept).toEqual([]);
		expect(dropped).toEqual([
			{ name: 'both', missingNodes: ['mention'], missingMarks: ['strong'] },
		]);
	});
});
