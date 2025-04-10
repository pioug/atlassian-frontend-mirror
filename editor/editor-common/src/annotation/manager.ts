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

	setPreemptiveGate(handler: () => Promise<boolean>): AnnotationManager {
		this.preemptiveGate = handler;
		return this;
	}

	checkPreemptiveGate(): Promise<boolean> {
		return this.preemptiveGate();
	}

	onDraftAnnotationStarted(handler: (data: AnnotationDraftStartedData) => void): AnnotationManager {
		this.emitter.on('draftAnnotationStarted', handler);
		return this;
	}
	offDraftAnnotationStarted(
		handler: (data: AnnotationDraftStartedData) => void,
	): AnnotationManager {
		this.emitter.off('draftAnnotationStarted', handler);
		return this;
	}

	onAnnotationSelectionChange(
		handler: (data: AnnotationSelectedChangeData) => void,
	): AnnotationManager {
		this.emitter.on('annotationSelectionChanged', handler);
		return this;
	}
	offAnnotationSelectionChange(
		handler: (data: AnnotationSelectedChangeData) => void,
	): AnnotationManager {
		this.emitter.off('annotationSelectionChanged', handler);
		return this;
	}

	emit(event: AnnotationManagerEvents): AnnotationManager {
		this.emitter.emit(event.name, event.data);
		return this;
	}

	hook<H extends keyof AnnotationManagerMethods>(
		method: H,
		handler: AnnotationManagerMethods[H],
	): AnnotationManager {
		this.hooks.set(method, handler);
		return this;
	}

	unhook<H extends keyof AnnotationManagerMethods>(
		method: H,
		handler: AnnotationManagerMethods[H],
	): AnnotationManager {
		if (!this.hooks.has(method) || this.hooks.get(method) !== handler) {
			return this;
		}
		this.hooks.delete(method);
		return this;
	}

	allowAnnotation(): boolean {
		const fn = this.hooks.get('allowAnnotation') as AnnotationManagerMethods['allowAnnotation'];

		if (!fn) {
			return false;
		}

		try {
			return fn();
		} catch (error) {
			return false;
		}
	}

	startDraft(): StartDraftResult {
		const fn = this.hooks.get('startDraft') as AnnotationManagerMethods['startDraft'];

		if (!fn) {
			return { success: false, reason: 'manager-not-initialized' };
		}

		try {
			const result = fn();

			if (result.success) {
				this.emitter.emit('draftAnnotationStarted', {
					targetElement: result.targetElement,
					inlineNodeTypes: result.inlineNodeTypes,
					actionResult: result.actionResult,
				});
			}

			return result;
		} catch (error) {
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
		} catch (error) {
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
		} catch (error) {
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
		} catch (error) {
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
		} catch (error) {
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
		} catch (error) {
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
		} catch (error) {
			return { success: false, reason: 'hook-execution-error' };
		}
	}
}
