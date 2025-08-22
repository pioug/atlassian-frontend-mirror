import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import type { CommandDispatch, EditorCommand } from '@atlaskit/editor-common/types';
import type { Fragment, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';

// TODO: ED-26959 - Remove type with `platform_editor_use_nested_table_pm_nodes` feature flag
export type InsertNodeActionConfig = {
	dispatch: CommandDispatch | undefined;
	node: PMNode | Fragment;
	options: {
		// TODO: ED-14676 - This approach to send analytics should be temporary only for the table work
		analyticsPayload?: AnalyticsEventPayload;

		// What: Override where the node should be inserted.
		// Why: You may want to insert a node in a different place than the current user selection.
		insertAt?: Selection;

		// What: The node inserted will be selected
		// Why: By design, the node inserted isn't select. This helps with the typing experience, for instance a follow key stroke should not replace the just-added-node but amend the current document. However, there are so cases where you may want to set the selection to the new node (e.g.: the date node, you may want to show the calendar popup.
		selectNodeInserted: boolean;

		// TODO: ED-14676 - We will need more options to cover the known insertion edge cases like: date & panel
		/*

    // What: Send a custom message using the PluginKey coming from the handler
    // Why: Some features may need to send some additional information to allow custom UI behavior (e.g: open a popup only the node was added by shorcut)
    attachPluginMessage?: unknown;

    // What: Override the cursor position after the node insertion
    // Why: By default, the selection will be moved to the next available spot. For instance, for Table Nodes, the selection is moved to the first cell, but if you may want to change it for complexes nodes or specific scenarios.
    transformSelection?: (selection: Selection) => Selection;

    */
	};
	// To avoid race conditions issues during the insertion phase,
	// we need a fresh EditorView pointer to get the current EditorState
	state: EditorState | undefined | null;
};

export type InsertNodeConfig = {
	node: PMNode | Fragment;
	options: {
		// TODO: ED-14676 - This approach to send analytics should be temporary only for the table work
		analyticsPayload?: AnalyticsEventPayload;

		// What: Override where the node should be inserted.
		// Why: You may want to insert a node in a different place than the current user selection.
		insertAt?: Selection;

		// What: The node inserted will be selected
		// Why: By design, the node inserted isn't select. This helps with the typing experience, for instance a follow key stroke should not replace the just-added-node but amend the current document. However, there are so cases where you may want to set the selection to the new node (e.g.: the date node, you may want to show the calendar popup.
		selectNodeInserted: boolean;

		// TODO: ED-14676 - We will need more options to cover the known insertion edge cases like: date & panel
		/*

    // What: Send a custom message using the PluginKey coming from the handler
    // Why: Some features may need to send some additional information to allow custom UI behavior (e.g: open a popup only the node was added by shorcut)
    attachPluginMessage?: unknown;

    // What: Override the cursor position after the node insertion
    // Why: By default, the selection will be moved to the next available spot. For instance, for Table Nodes, the selection is moved to the first cell, but if you may want to change it for complexes nodes or specific scenarios.
    transformSelection?: (selection: Selection) => Selection;

    */
	};
};

export type InsertNodeAPI = {
	actions: {
		/**
		 * @private
		 * @deprecated The insert action should not be used. Use the insert command instead. (To be removed with feature gate: `platform_editor_use_nested_table_pm_nodes` as editor-plugin-table is the only consumer)
		 */
		insert: (props: InsertNodeActionConfig) => boolean;
	};
	commands: {
		insert: (props: InsertNodeConfig) => EditorCommand;
	};
};

export type CreateNodeHandler = ({
	nodeName,
	schema,
}: {
	nodeName: string;
	schema: Schema;
}) => PMNode;
