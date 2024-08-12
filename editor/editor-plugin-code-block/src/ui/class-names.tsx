import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

export const codeBlockClassNames = {
	container: CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER,
	start: CodeBlockSharedCssClassName.CODEBLOCK_START,
	end: CodeBlockSharedCssClassName.CODEBLOCK_END,
	contentWrapper: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER,
	gutter: CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER,
	content: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT,

	// Feature Gate editor_support_code_block_wrapping:
	contentWrapperFg: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER_FG,
	contentFg: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_FG,
	contentFgWrapped: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_FG_WRAPPED,
	lineNumberWidget: CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER_LINE_NUMBER_WIDGET,
	gutterFg: CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER_FG,
};
