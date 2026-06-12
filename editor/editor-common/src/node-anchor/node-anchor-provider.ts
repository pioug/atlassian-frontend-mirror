import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { isEmptyDocument } from '../utils';

import { DynamicBitArray } from './dynamic-bit-array';
import {
	LIMITED_MODE_DEFAULT_DOC_SIZE_THRESHOLD,
	LIMITED_MODE_DEFAULT_NODE_COUNT_THRESHOLD,
} from './limited-mode-document-thresholds';

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
	public setLimitedMode(): void {
		this.limitedMode = true;
		this.cache = new WeakMap<object, string>();
		this.existingPos = new DynamicBitArray();
		this.count = BigInt(0);
	}
}

const nodeIdProviderMap = new WeakMap<EditorView, NodeAnchorProvider>();

/**
 * Determines whether limited mode should be enabled.
 * This logic mirrors the limited mode plugin implementation, but lives here to avoid a circular dependency.
 * If it changes, update the matching logic in `editor-plugin-limited-mode/src/pm-plugins/main.ts`.
 *
 * Limited mode is activated when ANY of the following conditions are met:
 * 1. Document size exceeds `LIMITED_MODE_DEFAULT_DOC_SIZE_THRESHOLD` — checked first as O(1)
 * 2. Node count exceeds `LIMITED_MODE_DEFAULT_NODE_COUNT_THRESHOLD`
 * 3. Document contains a legacy-content macro (LCM)
 *
 * Performance optimisations:
 * - Doc size is checked first (O(1)) - if it exceeds threshold, we skip traversal entirely.
 * - If we find an LCM during traversal, we exit early since limited mode will be enabled.
 */
const isLimitedModeEnabled = (editorView: EditorView): boolean => {
	const doc = editorView.state.doc;
	const nodeCountThreshold = LIMITED_MODE_DEFAULT_NODE_COUNT_THRESHOLD;
	const docSizeThreshold = LIMITED_MODE_DEFAULT_DOC_SIZE_THRESHOLD;

	// Early exit: doc size exceeds threshold - O(1), no traversal needed
	if (doc.nodeSize > docSizeThreshold) {
		return true;
	}

	// Single traversal for node count and LCM detection
	let nodeCount = 0;
	let hasLcm = false;

	doc.descendants((node: PMNode) => {
		nodeCount += 1;

		if (node.attrs?.extensionKey === 'legacy-content') {
			hasLcm = true;

			// Early exit: LCM found — limited mode will be enabled
			return false;
		}
	});

	// LCM condition takes precedence (if we early exited traversal, this is why)
	if (hasLcm) {
		return true;
	}

	// Check node count threshold
	if (nodeCount > nodeCountThreshold) {
		return true;
	}

	return false;
};

// Get the NodeIdProvider for a specific EditorView instance.
// This allows access to the node ids anywhere.
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getNodeIdProvider: (editorView: EditorView) => NodeAnchorProvider = (editorView) => {
	if (!nodeIdProviderMap.has(editorView)) {
		// if the limited mode flag is on, enable limited mode based on the threshold
		// only for the first time
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
