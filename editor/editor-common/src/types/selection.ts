import type { JSONNode } from '@atlaskit/editor-json-transformer';
export interface LongPressSelectionPluginOptions {
	useLongPressSelection?: boolean;
}

export type SelectionContext = {
	/**
	 * End index of the selection inside the last node of the selection
	 */
	endIndex?: number | null;
	/**
	 * Local IDs of the selected nodes
	 */
	localIds: string[] | null;
	/**
	 * Prosemirror fragment of the selection converted to JSONNode array
	 *
	 * Note that this is a direct Prosemirror Fragment and has some slight tweaks
	 * so it performs better with AI models (e.g. reduced depth to reduce token count).
	 */
	selectionFragment: JSONNode[] | null;
	/**
	 * Selection in markdown format
	 */
	selectionMarkdown: string | null;
	/**
	 * Start index of the selection inside the first node of the selection
	 */
	startIndex?: number | null;
};
