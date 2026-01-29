/* eslint-disable @typescript-eslint/no-explicit-any */
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { doc, p, bodiedExtension, panel } from '@atlaskit/editor-test-helpers/doc-builder';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

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
	eeTest
		.describe('platform_editor_render_bodied_extension_as_inline', 'experiment disabled')
		.variant(false, () => {
			it('should NOT mark positions and should not call callback when experiment is disabled even if shouldDisplayExtensionAsInline is provided', () => {
				const mockCallback = jest.fn(() => true);

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
					shouldDisplayExtensionAsInline: mockCallback,
				});

				const getChildNodesSpy = jest.spyOn(serializer as any, 'getChildNodes');

				serializer.serializeFragment(document.content);

				expect(getChildNodesSpy).toHaveBeenCalled();
				const result = getChildNodesSpy.mock.results[0].value;

				// Nodes should remain unchanged
				expect(result).toEqual(expectedNodes);

				// Callback should NOT be called when experiment is disabled
				expect(mockCallback).not.toHaveBeenCalled();

				getChildNodesSpy.mockRestore();
			});
		});

	eeTest
		.describe('platform_editor_render_bodied_extension_as_inline', 'experiment enabled')
		.variant(true, () => {
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

			it('should mark inline positions when experiment is enabled and shouldDisplayExtensionAsInline returns true', () => {
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
		});

	eeTest.describe('platform_editor_render_bodied_extension_as_inline', '').each(() => {
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
});
