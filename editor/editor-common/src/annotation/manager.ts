import { EventEmitter } from 'events';

import type { AnnotationId } from '@atlaskit/adf-schema';

import type {
	AnnotationDraftStartedData,
	AnnotationManager,
	AnnotationManagerEvents,
	AnnotationManagerMethods,
	AnnotationSelectedChangeData,
	ApplyDraftResult,
	ClearAnnotationResult,
	ClearDraftResult,
	GetDraftResult,
	HoverAnnotationResult,
	SelectAnnotationResult,
	StartDraftResult,
} from './index';

export class SharedAnnotationManager implements AnnotationManager {
	/**
	 * This is the event emitter that is used to emit events from the manager. It is used to communicate with
	 * other parts of the application.
	 */
	private emitter: EventEmitter = new EventEmitter();

	/**
	 * This is the map of hooks that can be added to the manager. Hooks are a 1:1 mapping of methods that can be
	 * called on the manager. They are used to extend the functionality of the manager.
	 */
	private hooks: Map<
		keyof AnnotationManagerMethods,
		AnnotationManagerMethods[keyof AnnotationManagerMethods]
	> = new Map();

	private preemptiveGate: () => Promise<boolean> = () => Promise.resolve(true);
	private activePreemptiveGate: Promise<boolean> | undefined = undefined;

	setPreemptiveGate(handler: () => Promise<boolean>): AnnotationManager {
		this.preemptiveGate = handler;
		return this as AnnotationManager;
	}

	checkPreemptiveGate(): Promise<boolean> {
		if (this.activePreemptiveGate) {
			// If the preemptive gate check already in flight then just return the promise
			// and don't call the preemptive gate again.
			// This is to prevent multiple calls to the preemptive gate creating multiple
			// promises that will resolve at different times.
			return Promise.resolve(this.activePreemptiveGate);
		}

		const gate = (this.activePreemptiveGate = this.preemptiveGate().then((result) => {
			this.activePreemptiveGate = undefined;
			return result;
		}));

		return gate;
	}

	onDraftAnnotationStarted(handler: (data: AnnotationDraftStartedData) => void): AnnotationManager {
		this.emitter.on('draftAnnotationStarted', handler);
		return this as AnnotationManager;
	}
	offDraftAnnotationStarted(
		handler: (data: AnnotationDraftStartedData) => void,
	): AnnotationManager {
		this.emitter.off('draftAnnotationStarted', handler);
		return this as AnnotationManager;
	}

	onAnnotationSelectionChange(
		handler: (data: AnnotationSelectedChangeData) => void,
	): AnnotationManager {
		this.emitter.on('annotationSelectionChanged', handler);
		return this as AnnotationManager;
	}
	offAnnotationSelectionChange(
		handler: (data: AnnotationSelectedChangeData) => void,
	): AnnotationManager {
		this.emitter.off('annotationSelectionChanged', handler);
		return this as AnnotationManager;
	}

	emit(event: AnnotationManagerEvents): AnnotationManager {
		this.emitter.emit(event.name, 'data' in event ? event.data : undefined);
		return this as AnnotationManager;
	}

	hook<H extends keyof AnnotationManagerMethods>(
		method: H,
		handler: AnnotationManagerMethods[H],
	): AnnotationManager {
		this.hooks.set(method, handler);
		return this as AnnotationManager;
	}

	unhook<H extends keyof AnnotationManagerMethods>(
		method: H,
		handler: AnnotationManagerMethods[H],
	): AnnotationManager {
		if (!this.hooks.has(method) || this.hooks.get(method) !== handler) {
			return this as AnnotationManager;
		}
		this.hooks.delete(method);
		return this as AnnotationManager;
	}

	allowAnnotation(): boolean {
		const fn = this.hooks.get('allowAnnotation') as AnnotationManagerMethods['allowAnnotation'];

		if (!fn) {
			return false;
		}

		try {
			return fn();
		} catch {
			return false;
		}
	}

	startDraft(): StartDraftResult {
		const fn = this.hooks.get('startDraft') as AnnotationManagerMethods['startDraft'];

		if (!fn) {
			return { success: false, reason: 'manager-not-initialized' };
		}

		try {
			return fn();
		} catch {
			return { success: false, reason: 'hook-execution-error' };
		}
	}

	clearDraft(): ClearDraftResult {
		const fn = this.hooks.get('clearDraft') as AnnotationManagerMethods['clearDraft'];
		if (!fn) {
			return { success: false, reason: 'manager-not-initialized' };
		}
		try {
			return fn();
		} catch {
			return { success: false, reason: 'hook-execution-error' };
		}
	}

	applyDraft(id: AnnotationId): ApplyDraftResult {
		const fn = this.hooks.get('applyDraft') as AnnotationManagerMethods['applyDraft'];

		if (!fn) {
			return { success: false, reason: 'manager-not-initialized' };
		}

		try {
			return fn(id);
		} catch {
			return { success: false, reason: 'hook-execution-error' };
		}
	}

	getDraft(): GetDraftResult {
		const fn = this.hooks.get('getDraft') as AnnotationManagerMethods['getDraft'];
		if (!fn) {
			return { success: false, reason: 'manager-not-initialized' };
		}
		try {
			return fn();
		} catch {
			return { success: false, reason: 'hook-execution-error' };
		}
	}

	setIsAnnotationSelected(id: string, isSelected: boolean): SelectAnnotationResult {
		const fn = this.hooks.get(
			'setIsAnnotationSelected',
		) as AnnotationManagerMethods['setIsAnnotationSelected'];
		if (!fn) {
			return { success: false, reason: 'manager-not-initialized' };
		}

		try {
			// NOTE: The hook needs to manage the firing the annotationSelectionChanged event when a change is made. This is
			// because the hook is responsible for the state of the selection. The manager is not responsible for the state of
			// the selection.
			return fn(id, isSelected);
		} catch {
			return { success: false, reason: 'hook-execution-error' };
		}
	}

	setIsAnnotationHovered(id: string, isHovered: boolean): HoverAnnotationResult {
		const fn = this.hooks.get(
			'setIsAnnotationHovered',
		) as AnnotationManagerMethods['setIsAnnotationHovered'];
		if (!fn) {
			return { success: false, reason: 'manager-not-initialized' };
		}

		try {
			return fn(id, isHovered);
		} catch {
			return { success: false, reason: 'hook-execution-error' };
		}
	}

	clearAnnotation(id: AnnotationId): ClearAnnotationResult {
		const fn = this.hooks.get('clearAnnotation') as AnnotationManagerMethods['clearAnnotation'];
		if (!fn) {
			return { success: false, reason: 'manager-not-initialized' };
		}
		try {
			return fn(id);
		} catch {
			return { success: false, reason: 'hook-execution-error' };
		}
	}
}
