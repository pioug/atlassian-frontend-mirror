import type { ACTION, ACTION_SUBJECT } from './enums';
import type { TrackAEP } from './utils';

/** Which scoring path produced the suggestion shown to the user. */
export type CompletionSource =
	/** No slow-lane vector available yet; frequency-only trie scoring. */
	| 'cold'
	/** Server slow-lane API provided the context vector and LM logits. */
	| 'server'
	/** On-device WebGPU/MLC model provided the context vector and LM logits. */
	| 'localLlm';

type ContextualTypeaheadViewedAttributes = {
	completionSource: CompletionSource;
	surface: string;
};

type ContextualTypeaheadViewedAEP = TrackAEP<
	ACTION.SUGGESTION_VIEWED,
	ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
	undefined,
	ContextualTypeaheadViewedAttributes,
	undefined
>;

type ContextualTypeaheadAcceptedAttributes = {
	completionSource: CompletionSource;
	kssDelta: number;
	suggestionLength: number;
	surface: string;
	typedLength: number;
};

type ContextualTypeaheadAcceptedAEP = TrackAEP<
	ACTION.SUGGESTION_INSERTED,
	ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
	undefined,
	ContextualTypeaheadAcceptedAttributes,
	undefined
>;

type ContextualTypeaheadDismissedAttributes = {
	completionSource: CompletionSource;
	reason: 'escape' | 'blur';
	surface: string;
};

type ContextualTypeaheadDismissedAEP = TrackAEP<
	ACTION.SUGGESTION_DISMISSED,
	ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
	undefined,
	ContextualTypeaheadDismissedAttributes,
	undefined
>;

type ContextualTypeaheadLocalModelLoadedAttributes = {
	/** Semantic embedder loaded alongside the causal LM (loads atomically). */
	embeddingModelId: string;
	/** GPU architecture reported by the adapter (e.g. "metal-3"). */
	gpuArchitecture?: string;
	/** GPU vendor reported by the adapter (e.g. "apple", "intel"). */
	gpuVendor?: string;
	/** Model engine load time in ms (excludes the WebGPU capability probe). */
	loadDurationMs: number;
	/** Causal LM identifier that loaded. */
	modelId: string;
	/** Product/editor surface where autocomplete is running. */
	surface: string;
};

type ContextualTypeaheadLocalModelLoadedAEP = TrackAEP<
	ACTION.LOCAL_MODEL_LOADED,
	ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
	undefined,
	ContextualTypeaheadLocalModelLoadedAttributes,
	undefined
>;

type ContextualTypeaheadLocalModelLoadFailedAttributes = {
	/** Whether a usable WebGPU adapter was found on the machine. */
	adapterAvailable?: boolean;
	/** Semantic embedder loaded alongside the causal LM (loads atomically). */
	embeddingModelId: string;
	/** GPU architecture reported by the adapter (e.g. "metal-3"). */
	gpuArchitecture?: string;
	/** GPU vendor reported by the adapter (e.g. "apple", "intel"). */
	gpuVendor?: string;
	/** Largest single GPU buffer the adapter allows, in MB. */
	maxBufferSizeMB?: number;
	/** Largest storage-buffer binding the adapter allows, in MB. */
	maxStorageBufferBindingSizeMB?: number;
	/** Canonical, controlled failure description — derived from `reason`, never raw error text. */
	message: string;
	/** Causal LM identifier that failed to load. */
	modelId: string;
	/** Coarse, controlled failure category — never free-form. */
	reason:
		| 'webgpu_unavailable'
		| 'webgpu_no_adapter'
		| 'missing_shader_f16'
		| 'insufficient_memory'
		| 'model_download_failed'
		| 'module_load_failed'
		| 'init_failed';
	/** Product/editor surface where autocomplete is running. */
	surface: string;
	/** Whether the GPU supports the shader-f16 feature the model requires. */
	shaderF16Supported?: boolean;
	/** Whether navigator.gpu exists at all. */
	webgpuAvailable?: boolean;
};

type ContextualTypeaheadLocalModelLoadFailedAEP = TrackAEP<
	ACTION.LOCAL_MODEL_LOAD_FAILED,
	ACTION_SUBJECT.CONTEXTUAL_TYPEAHEAD,
	undefined,
	ContextualTypeaheadLocalModelLoadFailedAttributes,
	undefined
>;

export type ContextualTypeaheadEventPayload =
	| ContextualTypeaheadViewedAEP
	| ContextualTypeaheadAcceptedAEP
	| ContextualTypeaheadDismissedAEP
	| ContextualTypeaheadLocalModelLoadedAEP
	| ContextualTypeaheadLocalModelLoadFailedAEP;
