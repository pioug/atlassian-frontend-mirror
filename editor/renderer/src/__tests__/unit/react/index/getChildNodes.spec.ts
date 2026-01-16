/* eslint-disable @typescript-eslint/no-explicit-any */
import { PanelType } from '@atlaskit/adf-schema';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import {
	p as pAdf,
	panel as panelAdf,
	bodiedExtension as bodiedExtensionAdf,
} from '@atlaskit/adf-utils/builders';
import { doc, p, bodiedExtension, panel } from '@atlaskit/editor-test-helpers/doc-builder';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import ReactSerializer from '../../../../react';

const schema = defaultSchema;
const transformer = new JSONTransformer();

// Helper to encode the result from getChildNodes to ADF for comparison
function encodeResult(nodes: any[]) {
	return nodes.map((node) => {
		const docNode = schema.node('doc', null, [node]);
		return transformer.encode(docNode).content[0];
	});
}

describe('ReactSerializer - getChildNodes integration with inline bodied extension merging', () => {
	eeTest
		.describe('platform_editor_render_bodied_extension_as_inline', 'experiment disabled')
		.variant(false, () => {
			it('should NOT merge inline bodied extensions and should not call callback when experiment is disabled even if shouldDisplayExtensionAsInline is provided', () => {
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

				const serializer = new ReactSerializer({
					shouldDisplayExtensionAsInline: mockCallback,
				});

				const getChildNodesSpy = jest.spyOn(serializer as any, 'getChildNodes');

				serializer.serializeFragment(document.content);

				expect(getChildNodesSpy).toHaveBeenCalled();
				const result = getChildNodesSpy.mock.results[0].value;

				// Should NOT merge when experiment is disabled - returns 3 separate nodes
				expect(encodeResult(result)).toEqual([
					pAdf('Hello'),
					bodiedExtensionAdf({
						extensionType: 'com.atlassian.test',
						extensionKey: 'test-extension',
						layout: 'default',
					})(pAdf('Extension content')),
					pAdf('World'),
				]);

				// Callback should NOT be called when experiment is disabled
				expect(mockCallback).not.toHaveBeenCalled();

				getChildNodesSpy.mockRestore();
			});
		});

	eeTest
		.describe('platform_editor_render_bodied_extension_as_inline', 'experiment enabled')
		.variant(true, () => {
			it('should serialize fragments normally without merging extensions when shouldDisplayExtensionAsInline is not provided', () => {
				const document = doc(
					p('Hello'),
					bodiedExtension({
						extensionType: 'com.atlassian.test',
						extensionKey: 'test-extension',
						layout: 'default',
					})(p('Extension content')),
					p('World'),
				)(schema);

				const serializer = new ReactSerializer({});

				const getChildNodesSpy = jest.spyOn(serializer as any, 'getChildNodes');

				serializer.serializeFragment(document.content);

				expect(getChildNodesSpy).toHaveBeenCalled();
				const result = getChildNodesSpy.mock.results[0].value;

				// Should return 3 separate nodes (no merging)
				expect(encodeResult(result)).toEqual([
					pAdf('Hello'),
					bodiedExtensionAdf({
						extensionType: 'com.atlassian.test',
						extensionKey: 'test-extension',
						layout: 'default',
					})(pAdf('Extension content')),
					pAdf('World'),
				]);

				getChildNodesSpy.mockRestore();
			});

			it('should call mergeInlinedExtension when experiment is enabled and shouldDisplayExtensionAsInline is provided', () => {
				const document = doc(
					p('Hello'),
					bodiedExtension({
						extensionType: 'com.atlassian.test',
						extensionKey: 'test-extension',
						layout: 'default',
					})(p('Extension content')),
					p('World'),
				)(schema);

				const serializer = new ReactSerializer({
					shouldDisplayExtensionAsInline: () => true,
				});

				const getChildNodesSpy = jest.spyOn(serializer as any, 'getChildNodes');

				serializer.serializeFragment(document.content);

				expect(getChildNodesSpy).toHaveBeenCalled();
				const result = getChildNodesSpy.mock.results[0].value;

				// Should merge into a single paragraph
				expect(encodeResult(result)).toEqual([
					pAdf(
						'Hello',
						bodiedExtensionAdf({
							extensionType: 'com.atlassian.test',
							extensionKey: 'test-extension',
							layout: 'default',
						})(pAdf('Extension content')) as any,
						'World',
					),
				]);

				getChildNodesSpy.mockRestore();
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

				const serializer = new ReactSerializer({
					shouldDisplayExtensionAsInline: () => true,
				});

				const getChildNodesSpy = jest.spyOn(serializer as any, 'getChildNodes');

				serializer.serializeFragment(document.content);

				expect(getChildNodesSpy).toHaveBeenCalled();
				const result = getChildNodesSpy.mock.results[0].value;

				// Should merge paragraph + extension, but not merge with panel
				expect(encodeResult(result)).toEqual([
					pAdf('Hello'),
					pAdf('World'),
					panelAdf({ panelType: PanelType.INFO })(pAdf('Panel content')),
				]);

				getChildNodesSpy.mockRestore();
			});
		});
	});
});
