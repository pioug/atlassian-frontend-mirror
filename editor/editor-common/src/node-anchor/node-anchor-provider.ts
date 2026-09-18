import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { isEmptyDocument } from '../utils';
import { DynamicBitArray } from './dynamic-bit-array';

// The slice of `@atlaskit/editor-plugin-limited-mode`'s state read below. Declared
// structurally because `editor-common` must not depend on a plugin package.
type LimitedModePluginState = {
	documentSizeBreachesThreshold: boolean;
};

// The real key stays in `@atlaskit/editor-plugin-limited-mode`; importing it would make
// `editor-common` depend on a plugin package, so match the state property by name.
// `'limitedModePlugin$'` is what ProseMirror derives for `new PluginKey('limitedModePlugin')`,
// and editor-plugin-limited-mode-tests asserts that literal to catch it shifting to `$1`.
// Please, do not copy or use this kind of code below
// @ts-ignore
const limitedModePluginKey = {
	key: 'limitedModePlugin$',
	getState: (state: EditorState) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (state as any)['limitedModePlugin$'];
	},
} as PluginKey<LimitedModePluginState>;

export class NodeAnchorProvider {
	private cache = new WeakMap<object, string>();
	private count = BigInt(0);
	private existingPos = new DynamicBitArray();
	private limitedMode = false;
	private emptyDoc = false;

	constructor(limitedMode: boolean = false, emptyDoc: boolean = false) {
		this.limitedMode = limitedMode;
		this.emptyDoc = emptyDoc;
	}

	public isEmptyDoc(): boolean {
		return this.emptyDoc;
	}

	public setEmptyDoc(isEmpty: boolean): void {
		this.emptyDoc = isEmpty;
	}

	public isLimitedMode(): boolean {
		return this.limitedMode;
	}

	// We use pos to generate unique ids for each node at a specific position
	// This is to ensure the same ADF will always generate the same DOM initially
	public getOrGenerateId(node: PMNode, pos: number): string | undefined {
		if (this.limitedMode) {
			return undefined;
		}

		if (this.cache.has(node)) {
			return this.cache.get(node) as string;
		}

		let idSuffix = '';
		if (this.existingPos.get(pos)) {
			idSuffix = `-${(this.count++).toString(36)}`;
		} else {
			this.existingPos.set(pos, true);
		}

		const anchorName = `--anchor-${node.type.name}-${pos}${idSuffix}`;
		this.cache.set(node, anchorName);

		return anchorName;
	}

	public getIdForNode(node: PMNode): string | undefined {
		if (this.limitedMode) {
			return undefined;
		}

		return this.cache.get(node);
	}

	public setIdForNode(node: PMNode, id: string): void {
		if (this.limitedMode) {
			return;
		}

		this.cache.set(node, id);
	}

	// After set to limited mode, we clear the cache to free up memory
	// and prevent further ids from being generated
	// Once in limited mode, we won't exit it
	//
	// One-way by design, so this can stay latched on after the plugin flips back to
	// off: recovering would mean re-rendering every nodeview to restore its anchor.
	public setLimitedMode(): void {
		this.limitedMode = true;
		this.cache = new WeakMap<object, string>();
		this.existingPos = new DynamicBitArray();
		this.count = BigInt(0);
	}
}

const nodeIdProviderMap = new WeakMap<EditorView, NodeAnchorProvider>();

/**
 * Reads the limited-mode plugin's state and nothing else, so a preset without the plugin no longer
 * gets anchor suppression (and with it, no drag handles). No plugin means limited mode is off.
 *
 * Read off the state rather than the plugin injection API because plugin `state.init` is the only
 * thing that has run by the time the `EditorView` constructor builds its first nodeview and calls
 * `getNodeIdProvider`. Plugin views and `usePluginHook` both run later.
 */
const isLimitedModeEnabled = (editorView: EditorView): boolean =>
	limitedModePluginKey.getState(editorView.state)?.documentSizeBreachesThreshold ?? false;

// Get the NodeIdProvider for a specific EditorView instance.
// This allows access to the node ids anywhere.
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getNodeIdProvider: (editorView: EditorView) => NodeAnchorProvider = (editorView) => {
	if (!nodeIdProviderMap.has(editorView)) {
		const limitedMode = isLimitedModeEnabled(editorView);
		const isEmptyDoc = isEmptyDocument(editorView.state.doc);

		const provider = new NodeAnchorProvider(limitedMode, isEmptyDoc);
		nodeIdProviderMap.set(editorView, provider);
		return provider;
	}

	const nodeIdProvider = nodeIdProviderMap.get(editorView) as NodeAnchorProvider;

	// in some cases we need to re-check limited mode state
	// Confluence editor can start with an empty doc and then load content later
	// so we need to check first time from an empty doc to a non-empty doc
	if (nodeIdProvider.isEmptyDoc() && !isEmptyDocument(editorView.state.doc)) {
		// set empty doc to false regardless of limited mode state
		nodeIdProvider.setEmptyDoc(false);

		if (!nodeIdProvider.isLimitedMode() && isLimitedModeEnabled(editorView)) {
			nodeIdProvider.setLimitedMode();
		}
	}

	// This is based on the fact that editorView is a singleton.
	return nodeIdProviderMap.get(editorView) as NodeAnchorProvider;
};
