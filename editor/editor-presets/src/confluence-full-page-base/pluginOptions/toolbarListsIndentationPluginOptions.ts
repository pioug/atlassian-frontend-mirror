import type { ToolbarListsIndentationPluginOptions } from '@atlaskit/editor-plugin-toolbar-lists-indentation';

interface Props {
	options: never;
}

export function toolbarListsIndentationPluginOptions({}: Props): ToolbarListsIndentationPluginOptions {
	return {
		showIndentationButtons: true,
		allowHeadingAndParagraphIndentation: true,
	};
}
