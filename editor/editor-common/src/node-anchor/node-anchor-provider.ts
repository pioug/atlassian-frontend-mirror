import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import { isEmptyDocument } from '../utils';

import { DynamicBitArray } from './dynamic-bit-array';

/**
 * Counts nodes in the document.
 *
 * Note: legacy-content macros add a damped contribution based on ADF length to avoid
 * parsing nested ADF on every check, which is inefficient.
 */
const countNodesInDoc = (doc: PMNode, lcmDampingFactor: number): number => {
	let nodeCount = 0;
	doc.descendants((node: PMNode) => {
		nodeCount += 1;

		if (node.attrs?.extensionKey === 'legacy-content') {
			const adfLength = node.attrs?.parameters?.adf?.length;

			if (typeof adfLength === 'number' && lcmDampingFactor > 0) {
				nodeCount += Math.ceil(adfLength / lcmDampingFactor);
			}
		}
	});

	return nodeCount;
};

/**
 * Guard against test overrides returning booleans for numeric params.
 */
const getNumericExperimentParam = (
	experimentName: 'cc_editor_limited_mode_expanded',
	paramName: 'lcmNodeCountDampingFactor' | 'nodeCountThreshold',
	fallbackValue: number,
): number => {
	const rawValue = expVal(experimentName, paramName, fallbackValue);

	if (typeof rawValue === 'number') {
		return rawValue;
	}

	return fallbackValue;
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

// This is duplicate from the limited mode plugin to avoid circular dependency
// We can refactor this later to have a shared util package
const isLimitedModeEnabled = (editorView: EditorView): boolean => {

	if (expVal('cc_editor_limited_mode_expanded', 'isEnabled', false)) {
		const lcmNodeCountDampingFactor = getNumericExperimentParam(
			'cc_editor_limited_mode_expanded',
			'lcmNodeCountDampingFactor',
			10,
		);
		const nodeCountThreshold = getNumericExperimentParam(
			'cc_editor_limited_mode_expanded',
			'nodeCountThreshold',
			1000,
		);
		const nodeCount = countNodesInDoc(
			editorView.state.doc,
			lcmNodeCountDampingFactor,
		);

		return nodeCount > nodeCountThreshold;
	} else {
		let customDocSize = editorView.state.doc.nodeSize;

		editorView.state.doc.descendants((node: PMNode) => {
			if (node.attrs?.extensionKey === 'legacy-content') {
				customDocSize += node.attrs?.parameters?.adf?.length ?? 0;
			}
		});

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
