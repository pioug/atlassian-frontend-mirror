/* eslint-disable @typescript-eslint/no-explicit-any */

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	doc,
	p,
	panel,
	bodiedExtension,
	layoutColumn,
	layoutSection,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import ReactSerializer from '../../../../react';

const schema = defaultSchema;

// Helper to extract child nodes from a document
function getDocChildNodes(document: PMNode): PMNode[] {
	const nodes: PMNode[] = [];
	document.content.forEach((node) => {
		nodes.push(node);
	});
	return nodes;
}

describe('ReactSerializer - getChildNodes integration with inline bodied extension marking', () => {
	it('joins top-level Custom UI neighbours without marking nested neighbours', () => {
		passGate('platform_forge_inline_bodied_layout_switch');
		passGate('platform_forge_inline_bodied_macro');
		const macro = () =>
			bodiedExtension({
				extensionType: 'com.atlassian.ecosystem',
				extensionKey: 'custom-ui',
				parameters: { layout: 'inline-bodied' },
			})(p('Inline'));
		const document = doc(
			p('Before'),
			macro(),
			p('After'),
			layoutSection(
				layoutColumn({ width: 50 })(p('Nested before'), macro(), p('Nested after')),
				layoutColumn({ width: 50 })(p('Other column')),
			),
		)(schema);
		const serializer = new ReactSerializer({ shouldDisplayExtensionAsInline: () => true });
		const onMark = jest.spyOn((serializer as any).inlinePositions as Set<number>, 'add');
		serializer.serializeFragment(document.content);
		expect(onMark).toHaveBeenCalledTimes(2);
		expect(onMark).toHaveBeenCalledWith(1);
		expect(onMark).toHaveBeenCalledWith(
			1 + document.child(0).nodeSize + document.child(1).nodeSize,
		);
		onMark.mockRestore();
	});
	it('should not mark positions when shouldDisplayExtensionAsInline is not provided', () => {
		const document = doc(
			p('Hello'),
			bodiedExtension({
				extensionType: 'com.atlassian.test',
				extensionKey: 'test-extension',
				layout: 'default',
			})(p('Extension content')),
			p('World'),
		)(schema);

		const expectedNodes = getDocChildNodes(document);

		const serializer = new ReactSerializer({});

		const inlinePositionsSpy = jest.spyOn(
			(serializer as any).inlinePositions as Set<number>,
			'add',
		);
		const getChildNodesSpy = jest.spyOn(serializer as any, 'getChildNodes');

		serializer.serializeFragment(document.content);

		expect(getChildNodesSpy).toHaveBeenCalled();
		const result = getChildNodesSpy.mock.results[0].value;

		// Nodes should remain unchanged
		expect(result).toEqual(expectedNodes);

		// Should not mark any positions
		expect(inlinePositionsSpy).not.toHaveBeenCalled();

		getChildNodesSpy.mockRestore();
		inlinePositionsSpy.mockRestore();
	});

	it('should mark inline positions when shouldDisplayExtensionAsInline returns true', () => {
		const document = doc(
			p('Hello'),
			bodiedExtension({
				extensionType: 'com.atlassian.test',
				extensionKey: 'test-extension',
				layout: 'default',
			})(p('Extension content')),
			p('World'),
		)(schema);

		const expectedNodes = getDocChildNodes(document);

		const serializer = new ReactSerializer({
			shouldDisplayExtensionAsInline: () => true,
		});

		const inlinePositionsSpy = jest.spyOn(
			(serializer as any).inlinePositions as Set<number>,
			'add',
		);
		const getChildNodesSpy = jest.spyOn(serializer as any, 'getChildNodes');

		serializer.serializeFragment(document.content);

		expect(getChildNodesSpy).toHaveBeenCalled();
		const result = getChildNodesSpy.mock.results[0].value;

		// Nodes should remain unchanged
		expect(result).toEqual(expectedNodes);

		// Should mark positions for inline display
		expect(inlinePositionsSpy).toHaveBeenCalled();

		getChildNodesSpy.mockRestore();
		inlinePositionsSpy.mockRestore();
	});

	it('should not mark positions when shouldDisplayExtensionAsInline returns false', () => {
		const document = doc(
			p('Hello'),
			bodiedExtension({
				extensionType: 'com.atlassian.test',
				extensionKey: 'test-extension',
				layout: 'default',
			})(p('Extension content')),
			p('World'),
		)(schema);

		const expectedNodes = getDocChildNodes(document);

		const serializer = new ReactSerializer({
			shouldDisplayExtensionAsInline: () => false,
		});

		const inlinePositionsSpy = jest.spyOn(
			(serializer as any).inlinePositions as Set<number>,
			'add',
		);
		const getChildNodesSpy = jest.spyOn(serializer as any, 'getChildNodes');

		serializer.serializeFragment(document.content);

		expect(getChildNodesSpy).toHaveBeenCalled();
		const result = getChildNodesSpy.mock.results[0].value;

		// Nodes should remain unchanged
		expect(result).toEqual(expectedNodes);

		// Should not mark any positions when callback returns false
		expect(inlinePositionsSpy).not.toHaveBeenCalled();

		getChildNodesSpy.mockRestore();
		inlinePositionsSpy.mockRestore();
	});

	describe('backward compatibility', () => {
		it('should not affect serialization of other node types when callback is provided', () => {
			const document = doc(
				// other node types
				p('Hello'),
				p('World'),
				panel({ panelType: 'info' })(p('Panel content')),
			)(schema);

			const expectedNodes = getDocChildNodes(document);

			const serializer = new ReactSerializer({
				shouldDisplayExtensionAsInline: () => true,
			});

			const getChildNodesSpy = jest.spyOn(serializer as any, 'getChildNodes');

			serializer.serializeFragment(document.content);

			expect(getChildNodesSpy).toHaveBeenCalled();
			const result = getChildNodesSpy.mock.results[0].value;

			// Nodes should remain unchanged
			expect(result).toEqual(expectedNodes);

			getChildNodesSpy.mockRestore();
		});
	});
});
