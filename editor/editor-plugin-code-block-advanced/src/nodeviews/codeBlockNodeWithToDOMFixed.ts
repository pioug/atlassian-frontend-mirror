/**
 * Commented out for hot-114295
 */
export const noop = () => {};
// import { codeBlock } from '@atlaskit/adf-schema';
// import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';
// import type { NodeSpec, DOMOutputSpec, Node } from '@atlaskit/editor-prosemirror/model';

// const codeBlockClassNames = {
// 	container: CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER,
// 	start: CodeBlockSharedCssClassName.CODEBLOCK_START,
// 	end: CodeBlockSharedCssClassName.CODEBLOCK_END,
// 	contentWrapper: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER,
// 	contentWrapped: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPED,
// 	gutter: CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER,
// 	content: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT,
// 	lineNumberWidget: CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER_LINE_NUMBER_WIDGET,
// };

// // From: `packages/editor/editor-plugin-code-block/src/nodeviews/code-block.ts`
// const toDOM = (node: Node, contentEditable: boolean, formattedAriaLabel: string): DOMOutputSpec => [
// 	'div',
// 	{ class: codeBlockClassNames.container },
// 	['div', { class: codeBlockClassNames.start, contenteditable: 'false' }],
// 	[
// 		'div',
// 		{
// 			class: codeBlockClassNames.contentWrapper,
// 		},
// 		[
// 			'div',
// 			{
// 				class: codeBlockClassNames.gutter,
// 				contenteditable: 'false',
// 			},
// 		],
// 		[
// 			'div',
// 			{
// 				class: codeBlockClassNames.content,
// 			},
// 			[
// 				'code',
// 				{
// 					'data-language': node.attrs.language || '',
// 					spellcheck: 'false',
// 					contenteditable: contentEditable ? 'true' : 'false',
// 					'data-testid': 'code-block--code',
// 					'aria-label': formattedAriaLabel,
// 				},
// 				0,
// 			],
// 		],
// 	],
// 	['div', { class: codeBlockClassNames.end, contenteditable: 'false' }],
// ];

// export const codeBlockNodeWithFixedToDOM = (): NodeSpec => {
// 	return {
// 		...codeBlock,
// 		toDOM: (node) => toDOM(node, false, ''),
// 	};
// };
