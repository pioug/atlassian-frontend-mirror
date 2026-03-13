import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

export const codeBlockClassNames: {
	container: string;
	start: string;
	end: string;
	contentWrapper: string;
	contentWrapped: string;
	gutter: string;
	content: string;
	lineNumberWidget: string;
} = {
	container: CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER,
	start: CodeBlockSharedCssClassName.CODEBLOCK_START,
	end: CodeBlockSharedCssClassName.CODEBLOCK_END,
	contentWrapper: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER,
	contentWrapped: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPED,
	gutter: CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER,
	content: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT,
	lineNumberWidget: CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER_LINE_NUMBER_WIDGET,
};
