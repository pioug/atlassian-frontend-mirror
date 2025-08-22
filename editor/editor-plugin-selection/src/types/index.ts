/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
export type { SelectionPluginState } from '@atlaskit/editor-common/selection';
import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types';
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Selection, Transaction } from '@atlaskit/editor-prosemirror/state';

export const selectionPluginKey = new PluginKey('selection');

export { RelativeSelectionPos };

export enum SelectionDirection {
	Before = -1,
	After = 1,
}

export type SetSelectionRelativeToNode = (props: {
	selection?: Selection | null;
	selectionRelativeToNode?: RelativeSelectionPos;
}) => (state: EditorState) => Transaction;

type SelectionUtilityOptions = {
	/**
	 * Use a specific selection rather than the current which is the default
	 */
	selection?: Selection;
};

export type EditorSelectionAPI = {
	/**
	 * Gets the current selection fragment.
	 * @param props Options to customise the selection fragment
	 * @param props.selection Use a specific selection rather than the current
	 * @returns The current selection fragment as an array of JSON nodes.
	 */
	getSelectionFragment: (props?: SelectionUtilityOptions) => JSONNode[] | null;
	/**
	 * Gets the current selection local IDs. This includes all local IDs
	 * @param props Options to customise the selection fragment
	 * @param props.selection Use a specific selection rather than the current
	 * @returns The current selection local IDs as an array of strings.
	 */
	getSelectionLocalIds: (props?: SelectionUtilityOptions) => string[] | null;
	selectNearNode: SetSelectionRelativeToNode;
};

export interface SelectionPluginOptions extends LongPressSelectionPluginOptions {
	/**
	 * There is expected to be temporary divergence between Live Page editor expand behaviour and the standard expand behaviour.
	 *
	 * This is expected to be removed in Q4 as Editor and Live Page teams align on a singular behaviour.
	 *
	 * It is only supported for use by Confluence.
	 *
	 * @default false
	 */
	__livePage?: boolean;
}
