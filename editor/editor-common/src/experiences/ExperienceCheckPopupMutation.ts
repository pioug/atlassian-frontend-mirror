import { getDocument } from '@atlaskit/browser-apis';

import { EXPERIENCE_FAILURE_REASON } from './consts';
import { popupWithNestedElement } from './experience-utils';
import type { ExperienceCheck, ExperienceCheckCallback } from './ExperienceCheck';

/**
 * Popup check type determines how popups are observed based on their DOM location:
 * - 'inline': Popups appearing in toolbar button-groups (emoji, media, table selector, image)
 * - 'editorRoot': Popups attached to editor root (e.g., mention popups)
 * - 'editorContent': Content-level popups or modals in portal containers (e.g., block menu)
 */
export type PopupCheckType = 'inline' | 'editorRoot' | 'editorContent';

export type ExperienceCheckPopupMutationConfig = {
	getEditorDom: () => HTMLElement | undefined | null;
	getTarget: () => HTMLElement | undefined | null;
	nestedElementQuery: string;
	type?: PopupCheckType;
};

export class ExperienceCheckPopupMutation implements ExperienceCheck {
	private getEditorDom: () => HTMLElement | undefined | null;
	private getTarget: () => HTMLElement | undefined | null;
	private nestedElementQuery: string;
	private observers: MutationObserver[] = [];
	private type: PopupCheckType;

	constructor({
		getEditorDom,
		getTarget,
		nestedElementQuery,
		type = 'editorRoot',
	}: ExperienceCheckPopupMutationConfig) {
		this.getEditorDom = getEditorDom;
		this.getTarget = getTarget;
		this.nestedElementQuery = nestedElementQuery;
		this.type = type;
	}

	/**
	 * Returns the list of DOM elements to observe based on popup type.
	 */
	private getObserveTargets(): HTMLElement[] {
		switch (this.type) {
			case 'inline':
				return this.getInlineTargets();
			case 'editorRoot':
				return this.getEditorRootTargets();
			case 'editorContent':
				return this.getEditorContentTargets();
		}
	}

	/**
	 * For 'editorContent' type: observe the target (mount point) and any existing
	 * [data-editor-popup] wrappers within it. Content-level popups and modals
	 * appear in portal containers.
	 */
	private getEditorContentTargets(): HTMLElement[] {
		const target = this.getTarget();

		if (!target) {
			return [];
		}

		const targets: HTMLElement[] = [target];
		const wrappers = target.querySelectorAll<HTMLElement>('[data-editor-popup]');
		for (const wrapper of wrappers) {
			targets.push(wrapper);
		}
		return targets;
	}

	/**
	 * For 'inline' type: observe the target element directly.
	 * The caller is responsible for resolving the correct container
	 * (e.g. the toolbar button-group) via the getTarget function.
	 */
	private getInlineTargets(): HTMLElement[] {
		const target = this.getTarget();

		if (!target) {
			return [];
		}

		return [target];
	}

	/**
	 * For 'editorRoot' type: observe the actual editor root container.
	 * The editorDom is the ProseMirror element, but popups appear as direct children
	 * of the parent .akEditor container. So we observe the parent of editorDom.
	 */
	private getEditorRootTargets(): HTMLElement[] {
		const targets: HTMLElement[] = [];
		const editorDom = this.getEditorDom();

		if (editorDom) {
			const editorRoot = editorDom.closest('.akEditor') || editorDom.parentElement;

			if (editorRoot instanceof HTMLElement) {
				targets.push(editorRoot);

				const wrappers = editorRoot.querySelectorAll<HTMLElement>('[data-editor-popup]');
				for (const wrapper of wrappers) {
					targets.push(wrapper);
				}
			}
		}

		return targets;
	}

	start(callback: ExperienceCheckCallback): void {
		this.stop();

		const target = this.getTarget();
		const doc = getDocument();
		if (!target || !doc) {
			callback({
				status: 'failure',
				reason: EXPERIENCE_FAILURE_REASON.DOM_MUTATION_TARGET_NOT_FOUND,
			});
			return;
		}

		const observeTargets = this.getObserveTargets();

		const query = this.nestedElementQuery;

		const observe = (el: HTMLElement) => {
			const observer = new MutationObserver(onMutation);
			observer.observe(el, { childList: true });
			this.observers.push(observer);
		};

		const onMutation = (mutations: MutationRecord[]) => {
			for (const mutation of mutations) {
				if (mutation.type !== 'childList') {
					continue;
				}
				for (const node of mutation.addedNodes) {
					if (!(node instanceof HTMLElement)) {
						continue;
					}
					const found =
						popupWithNestedElement(node, query) ||
						node.matches(query) ||
						!!node.querySelector(query);

					if (found) {
						callback({ status: 'success' });
						return;
					}
				}
			}
		};

		for (const observeTarget of observeTargets) {
			observe(observeTarget);
		}
	}

	stop(): void {
		for (const observer of this.observers) {
			observer.disconnect();
		}
		this.observers = [];
	}
}
