import type { BlockTypePluginOptions } from '@atlaskit/editor-plugin-block-type';

interface Props {
	options: never;
}

export function blockTypePluginOptions({}: Props): BlockTypePluginOptions {
	return {
		allowFontSize: true,
		includeBlockQuoteAsTextstyleOption: true,
		lastNodeMustBeParagraph: false,
		isUndoRedoButtonsEnabled: true,
		allowBlockType: undefined,
	};
}
