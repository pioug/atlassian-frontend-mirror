import { EventEmitter } from 'events';

import type { AnnotationId } from '@atlaskit/adf-schema';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type {
	AddNodeMarkStep,
	AddMarkStep,
	RemoveNodeMarkStep,
	RemoveMarkStep,
} from '@atlaskit/editor-prosemirror/transform';

import { SharedAnnotationManager } from './manager';

export type UpdateEvent =
	| 'create'
	| 'delete'
	| 'resolve'
	| 'unresolve'
	| 'setselectedannotation'
	| 'sethoveredannotation'
	| 'removehoveredannotation'
	| 'closeinlinecomment';
export type VisibilityEvent = 'setvisibility';

type AnnotationCallback = (params: string) => void;
type VisibilityCallback = (params: boolean) => void;

export class AnnotationUpdateEmitter extends EventEmitter {
	on(event: VisibilityEvent, listener: (isVisible: boolean) => void): this;
	on(event: UpdateEvent, listener: (annotationId: string) => void): this;
	on(event: string, listener: AnnotationCallback | VisibilityCallback): this {
		return super.on(event, listener);
	}
	off(event: string, listener: AnnotationCallback | VisibilityCallback): this {
		return super.removeListener(event, listener);
	}
}

type AnnotationByMatches = {
	matchIndex: number;
	numMatches: number;
	originalSelection: string;
	pos?: number;
	// isAnnotationAllowed?: boolean;
};

// type ActionResult = { step: Step; doc: JSONDocNode } | false;
export type ActionResult = {
	/** The list of types of all nodes, which wrap the annotation. */
	ancestorNodeTypes?: string[];
	doc: JSONDocNode;
	/** The list of types of all inline nodes, which were wrapped by annotation. */
	inlineNodeTypes?: string[];
	step: AddMarkStep | AddNodeMarkStep;
	targetNodeType?: string;
} & AnnotationByMatches;
// | false;

export type ClearAnnotationActionResult = {
	doc: JSONDocNode;
	step: RemoveMarkStep | RemoveNodeMarkStep;
};

// ### Events
export type AnnotationDraftStartedData = {
	/**
	 * The actionResult can be used by Product so they're able to perform the
	 * required NCS transaction to add the annotation to the document.
	 */
	actionResult: ActionResult | undefined;
	/**
	 * This list of inline node types at the draft selection location
	 */
	inlineNodeTypes: string[];
	targetElement: HTMLElement | undefined;
};

export type AnnotationSelectedChangeData = {
	annotationId: AnnotationId;
	inlineNodeTypes: string[];
	isSelected: boolean;
};

export type AnnotationManagerEvents =
	| {
			data: AnnotationDraftStartedData;
			name: 'draftAnnotationStarted';
	  }
	| {
			name: 'draftAnnotationCleared';
	  }
	| {
			data: AnnotationSelectedChangeData;
			name: 'annotationSelectionChanged';
	  };

// ### Hook Results
export type ManagerFailureReasons = 'manager-not-initialized' | 'hook-execution-error';

export type StartDraftResult =
	| { reason: ManagerFailureReasons | 'invalid-range' | 'draft-in-progress'; success: false }
	| ({ success: true } & AnnotationDraftStartedData);

export type ClearDraftResult =
	| { reason: ManagerFailureReasons | 'draft-not-started'; success: false }
	| { success: true };

export type ApplyDraftResult =
	| {
			reason: ManagerFailureReasons | 'draft-not-started' | 'range-no-longer-exists';
			success: false;
	  }
	| {
			/**
			 * The actionResult will be set if the id passed to the applyDraft method is different from the id created
			 * from the startDraft call.
			 */
			actionResult: ActionResult | undefined;
			success: true;

			targetElement: HTMLElement | undefined;
	  };

export type GetDraftResult =
	| { reason: ManagerFailureReasons | 'draft-not-started'; success: false }
	| ({ success: true } & AnnotationDraftStartedData);

export type ClearAnnotationResult =
	| { reason: ManagerFailureReasons | 'id-not-valid' | 'clear-failed'; success: false }
	| {
			actionResult: ClearAnnotationActionResult | undefined;
			success: true;
	  };

export type SelectAnnotationResult =
	| { reason: ManagerFailureReasons | 'id-not-valid' | 'draft-in-progress'; success: false }
	| {
			isSelected: boolean;
			success: true;
	  };

export type HoverAnnotationResult =
	| { reason: ManagerFailureReasons | 'id-not-valid'; success: false }
	| {
			isHovered: boolean;
			success: true;
	  };

/**
 * This is the list of methods which exist on the Manager interface. These are the methods that can be hooked into.
 */
export type AnnotationManagerMethods = {
	allowAnnotation: () => boolean;
	/**
	 * This will apply the current draft to the document.
	 *
	 * If an id is passed, it will be used to apply the draft, it will
	 * also generate a new actionResult value if the passed id is different from the one returned from the startDraft method.
	 *
	 * @param id The id of the annotation to apply. Ideally the same as the one returned from the startDraft method.
	 * If the id is different, the actionResult will contain a step and document with the new id. Changing the id is discouraged
	 * as this creates different behaviour between the editor and renderer.
	 */
	applyDraft: (id: AnnotationId) => ApplyDraftResult;
	clearAnnotation: (id: AnnotationId) => ClearAnnotationResult;

	clearDraft: () => ClearDraftResult;

	/**
	 * This can be used to inspect the current active draft.
	 * @returns The current draft data. If the draft is not started, it will return an error.
	 */
	getDraft: () => GetDraftResult;

	setIsAnnotationHovered: (id: AnnotationId, isHovered: boolean) => HoverAnnotationResult;
	setIsAnnotationSelected: (id: AnnotationId, isSelected: boolean) => SelectAnnotationResult;
	startDraft: () => StartDraftResult;
};

/*
 * This is the public interface for the AnnotationManager. It provides methods for interacting with the manager.
 */
export type AnnotationManager = AnnotationManagerMethods & {
	/**
	 * This method is used to run the configured preemptive gate check.
	 * @private
	 * @internal
	 */
	checkPreemptiveGate: () => Promise<boolean>;

	/**
	 * @private
	 * @internal
	 * This method is intended for internal Platform use only. It is not intended for use by Product code.
	 */
	emit: (
		event:
			| {
					data: AnnotationDraftStartedData;
					name: 'draftAnnotationStarted';
			  }
			| {
					name: 'draftAnnotationCleared';
			  }
			| {
					data: AnnotationSelectedChangeData;
					name: 'annotationSelectionChanged';
			  },
	) => AnnotationManager;

	/**
	 * @private
	 * @internal
	 * This method is intended for internal Platform use only. It is not intended for use by Product code.
	 */
	hook: <H extends keyof AnnotationManagerMethods>(
		method: H,
		handler: AnnotationManagerMethods[H],
	) => AnnotationManager;
	offAnnotationSelectionChange: (
		handler: (data: AnnotationSelectedChangeData) => void,
	) => AnnotationManager;

	offDraftAnnotationStarted: (
		handler: (data: AnnotationDraftStartedData) => void,
	) => AnnotationManager;
	onAnnotationSelectionChange: (
		handler: (data: AnnotationSelectedChangeData) => void,
	) => AnnotationManager;

	onDraftAnnotationStarted: (
		handler: (data: AnnotationDraftStartedData) => void,
	) => AnnotationManager;

	/**
	 * This method is used to set a preemptive gate. A preemptive gate is a function that will be called
	 * before the manager performs an action. If the function returns false, the action will not be performed.
	 */
	setPreemptiveGate: (handler: () => Promise<boolean>) => AnnotationManager;

	/**
	 *
	 * @internal
	 * This method is intended for internal Platform use only. It is not intended for use by Product code.
	 */
	unhook: <H extends keyof AnnotationManagerMethods>(
		method: H,
		handler: AnnotationManagerMethods[H],
	) => AnnotationManager;
};

/**
 * This is a factory method which creates a new instance of the AnnotationManager.
 *
 * @example
 * const annotationManager: AnnotationManager = createAnnotationManager();
 */
export function createAnnotationManager(): AnnotationManager {
	return new SharedAnnotationManager();
}
