import { EventEmitter } from 'events';

import type { AnnotationId } from '@atlaskit/adf-schema';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { AddNodeMarkStep, AddMarkStep } from '@atlaskit/editor-prosemirror/transform';

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
	originalSelection: string;
	numMatches: number;
	matchIndex: number;
	pos?: number;
	// isAnnotationAllowed?: boolean;
};

// type ActionResult = { step: Step; doc: JSONDocNode } | false;
export type ActionResult = {
	step: AddMarkStep | AddNodeMarkStep;
	doc: JSONDocNode;
	/** The list of types of all inline nodes, which were wrapped by annotation. */
	inlineNodeTypes?: string[];
	targetNodeType?: string;
} & AnnotationByMatches;
// | false;

// ### Events
export type AnnotationDraftStartedData = {
	targetElement: HTMLElement | undefined;
	/**
	 * This list of inline node types at the draft selection location
	 */
	inlineNodeTypes: string[];
	/**
	 * The actionResult can be used by Product so they're able to perform the
	 * required NCS transaction to add the annotation to the document.
	 */
	actionResult: ActionResult | undefined;
};

export type AnnotationSelectedChangeData = {
	annotationId: AnnotationId;
	isSelected: boolean;
	inlineNodeTypes: string[];
};

export type AnnotationManagerEvents =
	| {
			name: 'draftAnnotationStarted';
			data: AnnotationDraftStartedData;
	  }
	| {
			name: 'annotationSelectionChanged';
			data: AnnotationSelectedChangeData;
	  };

// ### Hook Results
export type ManagerFailureReasons = 'manager-not-initialized' | 'hook-execution-error';

export type StartDraftResult =
	| { success: false; reason: ManagerFailureReasons | 'invalid-range' | 'draft-in-progress' }
	| ({ success: true } & AnnotationDraftStartedData);

export type ClearDraftResult =
	| { success: false; reason: ManagerFailureReasons | 'draft-not-started' }
	| { success: true };

export type ApplyDraftResult =
	| {
			success: false;
			reason: ManagerFailureReasons | 'draft-not-started' | 'range-no-longer-exists';
	  }
	| {
			success: true;
			targetElement: HTMLElement | undefined;

			/**
			 * The actionResult will be set if the id passed to the applyDraft method is different from the id created
			 * from the startDraft call.
			 */
			actionResult: ActionResult | undefined;
	  };

export type GetDraftResult =
	| { success: false; reason: ManagerFailureReasons | 'draft-not-started' }
	| ({ success: true } & AnnotationDraftStartedData);

export type ClearAnnotationResult =
	| { success: false; reason: ManagerFailureReasons | 'id-not-valid' }
	| {
			success: true;
			actionResult: ActionResult | undefined;
	  };

export type SelectAnnotationResult =
	| { success: false; reason: ManagerFailureReasons | 'id-not-valid' }
	| {
			success: true;
			isSelected: boolean;
	  };

export type HoverAnnotationResult =
	| { success: false; reason: ManagerFailureReasons | 'id-not-valid' }
	| {
			success: true;
			isHovered: boolean;
	  };

/**
 * This is the list of methods which exist on the Manager interface. These are the methods that can be hooked into.
 */
export type AnnotationManagerMethods = {
	allowAnnotation: () => boolean;
	startDraft: () => StartDraftResult;
	clearDraft: () => ClearDraftResult;

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

	/**
	 * This can be used to inspect the current active draft.
	 * @returns The current draft data. If the draft is not started, it will return an error.
	 */
	getDraft: () => GetDraftResult;

	setIsAnnotationSelected: (id: AnnotationId, isSelected: boolean) => SelectAnnotationResult;
	setIsAnnotationHovered: (id: AnnotationId, isHovered: boolean) => HoverAnnotationResult;
	clearAnnotation: (id: AnnotationId) => ClearAnnotationResult;
};

/*
 * This is the public interface for the AnnotationManager. It provides methods for interacting with the manager.
 */
export type AnnotationManager = AnnotationManagerMethods & {
	/**
	 * This method is used to set a preemptive gate. A preemptive gate is a function that will be called
	 * before the manager performs an action. If the function returns false, the action will not be performed.
	 */
	setPreemptiveGate(handler: () => Promise<boolean>): AnnotationManager;

	/**
	 * This method is used to run the configured preemptive gate check.
	 * @private
	 * @internal
	 */
	checkPreemptiveGate(): Promise<boolean>;

	onDraftAnnotationStarted(handler: (data: AnnotationDraftStartedData) => void): AnnotationManager;
	offDraftAnnotationStarted(handler: (data: AnnotationDraftStartedData) => void): AnnotationManager;

	onAnnotationSelectionChange(
		handler: (data: AnnotationSelectedChangeData) => void,
	): AnnotationManager;
	offAnnotationSelectionChange(
		handler: (data: AnnotationSelectedChangeData) => void,
	): AnnotationManager;

	/**
	 * @private
	 * @internal
	 * This method is intended for internal Platform use only. It is not intended for use by Product code.
	 */
	emit(
		event:
			| {
					name: 'draftAnnotationStarted';
					data: AnnotationDraftStartedData;
			  }
			| {
					name: 'annotationSelectionChanged';
					data: AnnotationSelectedChangeData;
			  },
	): AnnotationManager;

	/**
	 * @private
	 * @internal
	 * This method is intended for internal Platform use only. It is not intended for use by Product code.
	 */
	hook<H extends keyof AnnotationManagerMethods>(
		method: H,
		handler: AnnotationManagerMethods[H],
	): AnnotationManager;

	/**
	 *
	 * @internal
	 * This method is intended for internal Platform use only. It is not intended for use by Product code.
	 */
	unhook<H extends keyof AnnotationManagerMethods>(
		method: H,
		handler: AnnotationManagerMethods[H],
	): AnnotationManager;
};

export function createAnnotationManager(): AnnotationManager {
	return new SharedAnnotationManager();
}
