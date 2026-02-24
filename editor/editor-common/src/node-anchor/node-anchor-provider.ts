import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import { isEmptyDocument } from '../utils';

import { DynamicBitArray } from './dynamic-bit-array';

/**
 * Gets a numeric experiment param, returning undefined if the value is not a valid number.
 * This guards against test overrides returning booleans or strings for numeric params.
 */
const getNumericExperimentParam = (
	paramName: 'nodeCountThreshold' | 'docSizeThreshold',
	fallbackValue: number,
): number | undefined => {
	const rawValue = expVal('cc_editor_limited_mode_expanded', paramName, fallbackValue);

	if (typeof rawValue === 'number') {
		return rawValue;
	}

	// Handle string values from test overrides
	if (typeof rawValue === 'string') {
		const parsed = parseInt(rawValue, 10);

		if (!isNaN(parsed)) {
			return parsed;
		}
	}

	return undefined;
};

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

const LIMITED_MODE_NODE_SIZE_THRESHOLD = 40000;

/**
 * Calculates custom document size including LCM ADF lengths (for non-expanded path).
 * This function can be removed when cc_editor_limited_mode_expanded is cleaned up.
 */
const getCustomDocSize = (doc: PMNode): number => {
	let lcmAdfLength = 0;

	doc.descendants((node: PMNode) => {
		if (node.attrs?.extensionKey === 'legacy-content') {
			lcmAdfLength += node.attrs?.parameters?.adf?.length ?? 0;
		}
	});

	return doc.nodeSize + lcmAdfLength;
};

/**
 * Determines whether limited mode should be enabled.
 * This logic mirrors the limited mode plugin implementation, but lives here to avoid a circular dependency.
 * If it changes, update the matching logic in `editor-plugin-limited-mode/src/pm-plugins/main.ts`.
 *
 * Under the expanded gate, limited mode is activated when ANY of the following conditions are met:
 * 1. Document size exceeds `docSizeThreshold` (if defined) - checked first as O(1)
 * 2. Node count exceeds `nodeCountThreshold` (if defined)
 * 3. Document contains a legacy-content macro (LCM) (if `includeLcmInThreshold` is true)
 *
 * Performance optimisations:
 * - Doc size is checked first (O(1)) - if it exceeds threshold, we skip traversal entirely.
 * - If `includeLcmInThreshold` is enabled and we find an LCM, we exit traversal early.
 * - If neither node count nor LCM conditions are configured, we skip traversal entirely.
 */
const isLimitedModeEnabled = (editorView: EditorView): boolean => {
	const doc = editorView.state.doc;

	if (expVal('cc_editor_limited_mode_expanded', 'isEnabled', false)) {
		const nodeCountThreshold = getNumericExperimentParam('nodeCountThreshold', 5000);
		const docSizeThreshold = getNumericExperimentParam('docSizeThreshold', 30000);
		const includeLcmInThreshold = Boolean(
			expVal('cc_editor_limited_mode_expanded', 'includeLcmInThreshold', false),
		);

		// Early exit: doc size exceeds threshold - O(1), no traversal needed
		if (docSizeThreshold !== undefined && doc.nodeSize > docSizeThreshold) {
			return true;
		}

		// Early exit: no traversal needed if neither condition is configured
		const needNodeCount = nodeCountThreshold !== undefined;

		if (!needNodeCount && !includeLcmInThreshold) {
			return false;
		}

		// Single traversal for node count and/or LCM detection
		let nodeCount = 0;
		let hasLcm = false;

		doc.descendants((node: PMNode) => {
			nodeCount += 1;

			if (node.attrs?.extensionKey === 'legacy-content') {
				hasLcm = true;

				// Early exit: LCM found and condition is enabled - no need to continue counting
				if (includeLcmInThreshold) {
					return false;
				}
			}
		});

		// LCM condition takes precedence (if we early exited traversal, this is why)
		if (includeLcmInThreshold && hasLcm) {
			return true;
		}

		// Check node count threshold
		if (needNodeCount && nodeCount > nodeCountThreshold) {
			return true;
		}

		return false;
	} else {
		const customDocSize = getCustomDocSize(doc);

		return customDocSize > LIMITED_MODE_NODE_SIZE_THRESHOLD;
	}
};

// Get the NodeIdProvider for a specific EditorView instance.
// This allows access to the node ids anywhere.
export const getNodeIdProvider: (editorView: EditorView) => NodeAnchorProvider = (editorView) => {
	if (!nodeIdProviderMap.has(editorView)) {
		if (fg('platform_editor_native_anchor_patch_2')) {
			// if the limited mode flag is on, enable limited mode based on the threshold
			// only for the first time
			const limitedMode = isLimitedModeEnabled(editorView);
			const isEmptyDoc = isEmptyDocument(editorView.state.doc);

			const provider = new NodeAnchorProvider(limitedMode, isEmptyDoc);
			nodeIdProviderMap.set(editorView, provider);
			return provider;
		}

		const provider = new NodeAnchorProvider();
		nodeIdProviderMap.set(editorView, provider);
		return provider;
	}

	const nodeIdProvider = nodeIdProviderMap.get(editorView) as NodeAnchorProvider;

	// in some cases we need to re-check limited mode state
	// Confluence editor can start with an empty doc and then load content later
	// so we need to check first time from an empty doc to a non-empty doc
	if (
		nodeIdProvider.isEmptyDoc() &&
		!isEmptyDocument(editorView.state.doc) &&
		fg('platform_editor_native_anchor_patch_2')
	) {
		// set empty doc to false regardless of limited mode state
		nodeIdProvider.setEmptyDoc(false);

		if (!nodeIdProvider.isLimitedMode() && isLimitedModeEnabled(editorView)) {
			nodeIdProvider.setLimitedMode();
		}
	}

	// This is based on the fact that editorView is a singleton.
	return nodeIdProviderMap.get(editorView) as NodeAnchorProvider;
};
