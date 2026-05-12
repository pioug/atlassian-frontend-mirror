import type { EditorPlugin } from '@atlaskit/editor-common/types';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

export interface DroppedPlugin {
	missingMarks: string[];
	missingNodes: string[];
	name: string;
}

export interface FilterPluginsForReconfigureResult {
	dropped: DroppedPlugin[];
	kept: EditorPlugin[];
}

/**
 * Used by `reconfigureState` to drop plugins from a freshly-built preset that
 * declare schema nodes/marks the current schema doesn't have. Plugins already
 * present before this reconfigure are kept untouched: they have demonstrably
 * coexisted with the schema (e.g. tests that mock a stripped-down schema), so
 * removing them now would be a regression.
 */
export function filterPluginsForReconfigure(
	editorPlugins: Array<EditorPlugin | undefined | null>,
	schema: Schema,
	previousPluginNames: ReadonlySet<string>,
): FilterPluginsForReconfigureResult {
	const availableNodeNames = new Set(Object.keys(schema.nodes));
	const availableMarkNames = new Set(Object.keys(schema.marks));
	const dropped: DroppedPlugin[] = [];

	const kept = editorPlugins.filter((plugin): plugin is EditorPlugin => {
		if (!plugin) {
			return false;
		}
		if (previousPluginNames.has(plugin.name)) {
			return true;
		}
		const missingNodes = plugin.nodes
			? plugin
					.nodes()
					.map((n) => n.name)
					.filter((n) => !availableNodeNames.has(n))
			: [];
		const missingMarks = plugin.marks
			? plugin
					.marks()
					.map((m) => m.name)
					.filter((m) => !availableMarkNames.has(m))
			: [];
		if (missingNodes.length > 0 || missingMarks.length > 0) {
			dropped.push({ name: plugin.name, missingNodes, missingMarks });
			return false;
		}
		return true;
	});

	return { kept, dropped };
}
