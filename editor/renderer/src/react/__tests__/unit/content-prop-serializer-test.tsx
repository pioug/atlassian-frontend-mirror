import React from 'react';

import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { ReactSerializer } from '../../../index';
import type { NodeContent } from '../../types';

const cellAttrs = { colspan: 1, rowspan: 1, colwidth: null, background: null };

const cell = (type: 'tableCell' | 'tableHeader', text: string) => ({
	type,
	attrs: cellAttrs,
	content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
});

const tableDoc = {
	type: 'doc',
	version: 1,
	content: [
		{
			type: 'table',
			attrs: { isNumberColumnEnabled: false, layout: 'default', __autoSize: false },
			content: [
				{
					type: 'tableRow',
					content: [cell('tableHeader', 'Head A'), cell('tableHeader', 'Head B')],
				},
				{ type: 'tableRow', content: [cell('tableCell', 'Body A'), cell('tableCell', 'Body B')] },
			],
		},
	],
};

const TABLE_NODE_TYPES = ['table', 'tableRow', 'tableHeader', 'tableCell'] as const;

type Recorded = { content: NodeContent | undefined; getContent: NodeContent | undefined };

// Stub node components so the assertions cover what `getProps` hands over, not the real table
// components' internals.
const serializeTableDoc = ({ readContent }: { readContent: boolean }) => {
	const recorded: Record<string, Recorded[]> = {};

	const stub = (nodeType: string) => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const Stub = ({ children, content, getContent }: any) => {
			recorded[nodeType] = recorded[nodeType] ?? [];
			recorded[nodeType].push({
				content,
				getContent: readContent ? getContent() : undefined,
			});
			return <div data-node-type={nodeType}>{children}</div>;
		};
		Stub.displayName = `Stub(${nodeType})`;
		return Stub;
	};

	const serializer = new ReactSerializer({
		allowAnnotations: false,
		nodeComponents: {
			paragraph: stub('paragraph'),
			table: stub('table'),
			tableCell: stub('tableCell'),
			tableHeader: stub('tableHeader'),
			tableRow: stub('tableRow'),
		},
	});

	const toJSONSpy = jest.spyOn(Fragment.prototype, 'toJSON');
	const doc = schema.nodeFromJSON(tableDoc);
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	render(serializer.serializeFragment(doc.content) as any);
	const toJSONCalls = toJSONSpy.mock.calls.length;
	toJSONSpy.mockRestore();

	return { recorded, toJSONCalls };
};

const expectedTableContent = {
	table: [
		[expect.objectContaining({ type: 'tableRow' }), expect.objectContaining({ type: 'tableRow' })],
	],
	tableRow: [
		[
			expect.objectContaining({ type: 'tableHeader' }),
			expect.objectContaining({ type: 'tableHeader' }),
		],
		[
			expect.objectContaining({ type: 'tableCell' }),
			expect.objectContaining({ type: 'tableCell' }),
		],
	],
};

const ALL_NODE_TYPES = [...TABLE_NODE_TYPES, 'paragraph'] as const;

describe('Renderer - ReactSerializer - content props', () => {
	it('provides no content prop and defers serialization to getContent', () => {
		const unread = serializeTableDoc({ readContent: false });
		expect(screen.getByText('Body B')).toBeInTheDocument();

		const read = serializeTableDoc({ readContent: true });

		// Nothing read `getContent()`, so the table subtree was never serialized. A plain property
		// getter would not have deferred anything here: spreads in getProps' callers and React's own
		// props copy both materialize it before a component runs.
		expect(unread.toJSONCalls).toBeLessThan(read.toJSONCalls / 2);

		ALL_NODE_TYPES.forEach((nodeType) => {
			read.recorded[nodeType].forEach(({ content }) => {
				expect(content).toBeUndefined();
			});
		});

		expect(read.recorded.table.map((entry) => entry.getContent)).toEqual(
			expectedTableContent.table,
		);
		expect(read.recorded.tableRow.map((entry) => entry.getContent)).toEqual(
			expectedTableContent.tableRow,
		);
		read.recorded.tableHeader.concat(read.recorded.tableCell).forEach(({ getContent }) => {
			expect(getContent).toEqual([expect.objectContaining({ type: 'paragraph' })]);
		});
	});

	it('serves non-table nodes through getContent too', () => {
		// Confluence's announcement banner reads paragraph content this way.
		const read = serializeTableDoc({ readContent: true });

		expect(read.recorded.paragraph).toHaveLength(4);
		read.recorded.paragraph.forEach(({ content, getContent }) => {
			expect(content).toBeUndefined();
			expect(getContent).toEqual([expect.objectContaining({ type: 'text' })]);
		});
	});

	it('returns null from getContent on a childless node', () => {
		const recorded: Recorded[] = [];
		const serializer = new ReactSerializer({
			allowAnnotations: false,
			nodeComponents: {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				rule: ({ content, getContent }: any) => {
					recorded.push({ content, getContent: getContent() });
					return <hr />;
				},
			},
		});
		const doc = schema.nodeFromJSON({
			type: 'doc',
			version: 1,
			content: [{ type: 'rule' }, { type: 'paragraph', content: [{ type: 'text', text: 'x' }] }],
		});

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		render(serializer.serializeFragment(doc.content) as any);

		expect(recorded).toEqual([{ content: undefined, getContent: null }]);
	});

	// `getHeadingProps` used to re-assign `content` after spreading `getProps`, which silently
	// handed out an eagerly serialized array that was not the memoized one.
	it('defers heading content through getContent', () => {
		const recorded: Recorded[] = [];
		const serializer = new ReactSerializer({
			allowAnnotations: false,
			nodeComponents: {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				heading: ({ children, content, getContent }: any) => {
					recorded.push({ content, getContent: getContent() });
					return <h1>{children}</h1>;
				},
			},
		});
		const doc = schema.nodeFromJSON({
			type: 'doc',
			version: 1,
			content: [
				{ type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Title' }] },
			],
		});
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		render(serializer.serializeFragment(doc.content) as any);

		expect(recorded).toHaveLength(1);
		expect(recorded[0].content).toBeUndefined();
		expect(recorded[0].getContent).toEqual([
			expect.objectContaining({ type: 'text', text: 'Title' }),
		]);
	});

	// Extension handlers are the one consumer that must always receive the serialized body.
	it('still passes the macro body to extension handlers on node.content', () => {
		const received: unknown[] = [];
		const serializer = new ReactSerializer({
			allowAnnotations: false,
			// ExtensionRenderer reads `rendererContext.adDoc` when invoking the handler, so this has
			// to be present or the call throws before the handler ever runs.
			objectContext: {},
			extensionHandlers: {
				'com.atlassian.fabric': (node) => {
					received.push(node.content);
					return <p>handled</p>;
				},
			},
		});

		const doc = schema.nodeFromJSON({
			type: 'doc',
			version: 1,
			content: [
				{
					type: 'bodiedExtension',
					attrs: {
						extensionType: 'com.atlassian.fabric',
						extensionKey: 'body',
						parameters: {},
						layout: 'default',
					},
					content: [{ type: 'paragraph', content: [{ type: 'text', text: 'macro body' }] }],
				},
			],
		});

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		render(serializer.serializeFragment(doc.content) as any);

		expect(received).not.toHaveLength(0);
		expect(received[0]).toEqual([
			expect.objectContaining({
				type: 'paragraph',
				content: [expect.objectContaining({ type: 'text', text: 'macro body' })],
			}),
		]);
	});
});
