import type { BlockTypePluginOptions } from '@atlaskit/editor-plugin-block-type';

interface Props {
	options: never;
}

export function blockTypePluginOptions({}: Props): BlockTypePluginOptions {
	return {
		// rolling out under platform_editor_small_font_size experiment
		allowFontSize: true,
		includeBlockQuoteAsTextstyleOption: true,
		lastNodeMustBeParagraph: false,
		isUndoRedoButtonsEnabled: true,
		allowBlockType: undefined,
	};
}
