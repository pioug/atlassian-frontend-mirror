import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { doc, p, bodiedExtension, h1 } from '@atlaskit/editor-test-helpers/doc-builder';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { markBlockAsInline } from '../../../react/utils/markBlockAsInline';

const schema = defaultSchema;

describe('Custom UI inline-bodied paragraph composition', () => {
	const document = doc(
		p('Before'),
		bodiedExtension({
			extensionType: 'com.atlassian.ecosystem',
			extensionKey: 'custom-ui',
			parameters: { layout: 'inline-bodied' },
		})(p('Inline')),
		p('after'),
	)(schema);

	it('marks both neighbouring paragraphs at the top level', () => {
		const onMark = jest.fn();
		markBlockAsInline({
			nodes: getChildNodes(document),
			onMark,
			parentPos: 1,
			shouldDisplayExtensionAsInline: (node) => node.parameters?.layout === 'inline-bodied',
		});
		expect(onMark).toHaveBeenCalledWith({ pos: 1 });
		expect(onMark).toHaveBeenCalledWith({
			pos: 1 + document.child(0).nodeSize + document.child(1).nodeSize,
		});
		expect(onMark).toHaveBeenCalledTimes(2);
	});

	it('does not join neighbours of nested Custom UI macros', () => {
		passGate('platform_forge_inline_bodied_layout_switch');
		passGate('platform_forge_inline_bodied_macro');
		const onMark = jest.fn();
		const shouldDisplayExtensionAsInline = jest.fn().mockReturnValue(true);
		markBlockAsInline({
			nodes: getChildNodes(document),
			onMark,
			parentPos: 1,
			isTopLevel: false,
			shouldDisplayExtensionAsInline,
		});
		expect(onMark).not.toHaveBeenCalled();
		expect(shouldDisplayExtensionAsInline).not.toHaveBeenCalled();
	});

	it('preserves existing nested composition when the layout gate is off', () => {
		failGate('platform_forge_inline_bodied_layout_switch');
		const onMark = jest.fn();
		markBlockAsInline({
			nodes: getChildNodes(document),
			onMark,
			parentPos: 1,
			isTopLevel: false,
			shouldDisplayExtensionAsInline: () => true,
		});
		expect(onMark).toHaveBeenCalledTimes(2);
	});
});

// Helper to extract child nodes from a document
function getChildNodes(document: PMNode): PMNode[] {
	const nodes: PMNode[] = [];
	document.content.forEach((node) => {
		nodes.push(node);
	});
	return nodes;
}

it('should not call onMark when nodes array is empty', () => {
	const onMark = jest.fn();
	const shouldDisplayExtensionAsInline = jest.fn().mockReturnValue(true);

	markBlockAsInline({
		nodes: [],
		onMark,
		parentPos: 1,
		shouldDisplayExtensionAsInline,
	});

	expect(onMark).not.toHaveBeenCalled();
	expect(shouldDisplayExtensionAsInline).not.toHaveBeenCalled();
});

describe('when previous node is textblock and current node is an inline bodied extension', () => {
	it('should call onMark with previous node position', () => {
		const onMark = jest.fn();
		const shouldDisplayExtensionAsInline = jest.fn().mockReturnValue(true);

		const document = doc(
			p('Hello'),
			bodiedExtension({
				extensionType: 'com.atlassian.test',
				extensionKey: 'test-extension',
				layout: 'default',
			})(p('Extension content')),
		)(schema);

		const nodes = getChildNodes(document);

		markBlockAsInline({
			nodes,
			onMark,
			parentPos: 1,
			shouldDisplayExtensionAsInline,
		});

		expect(onMark).toHaveBeenCalledWith({ pos: 1 });
		expect(onMark).toHaveBeenCalledTimes(1);
	});

	it('should not call onMark if shouldDisplayExtensionAsInline returns false', () => {
		const onMark = jest.fn();
		const shouldDisplayExtensionAsInline = jest.fn().mockReturnValue(false);

		const document = doc(
			p('Hello'),
			bodiedExtension({
				extensionType: 'com.atlassian.test',
				extensionKey: 'test-extension',
				layout: 'default',
			})(p('Extension content')),
		)(schema);

		const nodes = getChildNodes(document);

		markBlockAsInline({
			nodes,
			onMark,
			parentPos: 1,
			shouldDisplayExtensionAsInline,
		});

		expect(onMark).not.toHaveBeenCalled();
	});
});

describe('when previous node is an inline bodied extension and current node is textblock', () => {
	it('should call onMark with current node position', () => {
		const onMark = jest.fn();
		const shouldDisplayExtensionAsInline = jest.fn().mockReturnValue(true);

		const document = doc(
			bodiedExtension({
				extensionType: 'com.atlassian.test',
				extensionKey: 'test-extension',
				layout: 'default',
			})(p('Extension content')),
			p('World'),
		)(schema);

		const nodes = getChildNodes(document);
		const extensionNodeSize = nodes[0].nodeSize;

		markBlockAsInline({
			nodes,
			onMark,
			parentPos: 1,
			shouldDisplayExtensionAsInline,
		});

		// Position should be parentPos (1) + first node's size
		expect(onMark).toHaveBeenCalledWith({ pos: 1 + extensionNodeSize });
		expect(onMark).toHaveBeenCalledTimes(1);
	});

	it('should not call onMark if textblock type differs from previous textblock type', () => {
		const onMark = jest.fn();
		const shouldDisplayExtensionAsInline = jest.fn().mockReturnValue(true);

		const document = doc(
			p('Hello'),
			bodiedExtension({
				extensionType: 'com.atlassian.test',
				extensionKey: 'test-extension',
				layout: 'default',
			})(p('Extension content')),
			h1('Heading'),
		)(schema);

		const nodes = getChildNodes(document);

		markBlockAsInline({
			nodes,
			onMark,
			parentPos: 1,
			shouldDisplayExtensionAsInline,
		});

		// Only first paragraph position (1) should be marked (textblock + bodiedExtension)
		// heading should NOT be marked (different type from previous textblock)
		expect(onMark).toHaveBeenCalledWith({ pos: 1 });
		expect(onMark).toHaveBeenCalledTimes(1);
	});

	it('should call onMark for both nodes if textblock type matches previous textblock type', () => {
		const onMark = jest.fn();
		const shouldDisplayExtensionAsInline = jest.fn().mockReturnValue(true);

		const document = doc(
			p('Hello'),
			bodiedExtension({
				extensionType: 'com.atlassian.test',
				extensionKey: 'test-extension',
				layout: 'default',
			})(p('Extension content')),
			p('World'),
		)(schema);

		const nodes = getChildNodes(document);
		const firstParagraphSize = nodes[0].nodeSize;
		const extensionSize = nodes[1].nodeSize;

		markBlockAsInline({
			nodes,
			onMark,
			parentPos: 1,
			shouldDisplayExtensionAsInline,
		});

		// para-1 position (1) should be marked (textblock + bodiedExtension)
		expect(onMark).toHaveBeenCalledWith({ pos: 1 });
		// para-2 position (1 + firstParagraphSize + extensionSize) should be marked
		expect(onMark).toHaveBeenCalledWith({ pos: 1 + firstParagraphSize + extensionSize });
		expect(onMark).toHaveBeenCalledTimes(2);
	});

	it('should handle multiple consecutive inline extensions', () => {
		const onMark = jest.fn();
		const shouldDisplayExtensionAsInline = jest.fn().mockReturnValue(true);

		const document = doc(
			p('Hello'),
			bodiedExtension({
				extensionType: 'com.atlassian.test',
				extensionKey: 'test-extension-1',
				layout: 'default',
			})(p('Extension 1')),
			bodiedExtension({
				extensionType: 'com.atlassian.test',
				extensionKey: 'test-extension-2',
				layout: 'default',
			})(p('Extension 2')),
			p('World'),
		)(schema);

		const nodes = getChildNodes(document);
		const firstParagraphSize = nodes[0].nodeSize;
		const firstExtensionSize = nodes[1].nodeSize;
		const secondExtensionSize = nodes[2].nodeSize;

		markBlockAsInline({
			nodes,
			onMark,
			parentPos: 1,
			shouldDisplayExtensionAsInline,
		});

		// para-1 position (1) should be marked (textblock + first bodiedExtension)
		expect(onMark).toHaveBeenCalledWith({ pos: 1 });
		// para-2 position should be marked (second bodiedExtension + textblock)
		expect(onMark).toHaveBeenCalledWith({
			pos: 1 + firstParagraphSize + firstExtensionSize + secondExtensionSize,
		});
		expect(onMark).toHaveBeenCalledTimes(2);
	});
});

it('should pass correct extension params to shouldDisplayExtensionAsInline', () => {
	const onMark = jest.fn();
	const shouldDisplayExtensionAsInline = jest.fn().mockReturnValue(true);

	const document = doc(
		p('Hello'),
		bodiedExtension({
			extensionType: 'com.atlassian.test',
			extensionKey: 'test-key',
			layout: 'default',
			localId: 'extension-local-id',
			parameters: { macroParams: { key: 'value' } },
		})(p('Extension content')),
	)(schema);

	const nodes = getChildNodes(document);

	markBlockAsInline({
		nodes,
		onMark,
		parentPos: 1,
		shouldDisplayExtensionAsInline,
	});

	expect(shouldDisplayExtensionAsInline).toHaveBeenCalledWith(
		expect.objectContaining({
			type: 'bodiedExtension',
			extensionKey: 'test-key',
			extensionType: 'com.atlassian.test',
			localId: 'extension-local-id',
			parameters: { macroParams: { key: 'value' } },
		}),
	);
});

it('should not call onMark when first node is a bodied extension with no previous textblock', () => {
	const onMark = jest.fn();
	const shouldDisplayExtensionAsInline = jest.fn().mockReturnValue(true);

	const document = doc(
		bodiedExtension({
			extensionType: 'com.atlassian.test',
			extensionKey: 'test-extension',
			layout: 'default',
		})(p('Extension content')),
	)(schema);

	const nodes = getChildNodes(document);

	markBlockAsInline({
		nodes,
		onMark,
		parentPos: 1,
		shouldDisplayExtensionAsInline,
	});

	// Nothing should be marked since there's no previous node
	expect(onMark).not.toHaveBeenCalled();
});

it('should not call onMark for consecutive textblocks', () => {
	const onMark = jest.fn();
	const shouldDisplayExtensionAsInline = jest.fn().mockReturnValue(true);

	const document = doc(p('Hello'), p('World'))(schema);

	const nodes = getChildNodes(document);

	markBlockAsInline({
		nodes,
		onMark,
		parentPos: 1,
		shouldDisplayExtensionAsInline,
	});

	expect(onMark).not.toHaveBeenCalled();
	expect(shouldDisplayExtensionAsInline).not.toHaveBeenCalled();
});
