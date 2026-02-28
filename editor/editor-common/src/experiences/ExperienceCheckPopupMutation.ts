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

type InlineConfig = {
	getTarget: () => HTMLElement | undefined | null;
	nestedElementQuery: string;
	/**
	 * Observe the entire subtree for mutations, not just direct children.
	 * Use with caution — only enable when the observed DOM subtree is small/lightweight
	 * (e.g. a single toolbar button). Enabling on large subtrees can cause performance issues.
	 */
	subtree?: boolean;
	type: 'inline';
};

type EditorRootConfig = {
	getEditorDom: () => HTMLElement | undefined | null;
	nestedElementQuery: string;
	type: 'editorRoot';
};

type EditorContentConfig = {
	getTarget: () => HTMLElement | undefined | null;
	nestedElementQuery: string;
	type: 'editorContent';
};

export type ExperienceCheckPopupMutationConfig =
	| InlineConfig
	| EditorRootConfig
	| EditorContentConfig;

export class ExperienceCheckPopupMutation implements ExperienceCheck {
	private config: ExperienceCheckPopupMutationConfig;
	private observers: MutationObserver[] = [];

	constructor(config: ExperienceCheckPopupMutationConfig) {
		this.config = config;
	}

	/**
	 * Returns the list of DOM elements to observe based on popup type.
	 */
	private getObserveTargets(): HTMLElement[] {
		const { config } = this;
		switch (config.type) {
			case 'inline':
				return this.getInlineTargets(config);
			case 'editorRoot':
				return this.getEditorRootTargets(config);
			case 'editorContent':
				return this.getEditorContentTargets(config);
		}
	}

	/**
	 * For 'editorContent' type: observe the target (mount point) and any existing
	 * [data-editor-popup] wrappers within it. Content-level popups and modals
	 * appear in portal containers.
	 */
	private getEditorContentTargets(config: EditorContentConfig): HTMLElement[] {
		const target = config.getTarget();

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
	private getInlineTargets(config: InlineConfig): HTMLElement[] {
		const target = config.getTarget();

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
	private getEditorRootTargets(config: EditorRootConfig): HTMLElement[] {
		const targets: HTMLElement[] = [];
		const editorDom = config.getEditorDom();

		if (editorDom) {
			const editorRoot = editorDom.closest('.akEditor') || editorDom.parentElement;

			if (editorRoot instanceof HTMLElement) {
				targets.push(editorRoot);
			}
		}

		return targets;
	}

	start(callback: ExperienceCheckCallback): void {
		const target =
			this.config.type === 'editorRoot' ? this.config.getEditorDom() : this.config.getTarget();
		const doc = getDocument();
		if (!target || !doc) {
			callback({
				status: 'failure',
				reason: EXPERIENCE_FAILURE_REASON.DOM_MUTATION_TARGET_NOT_FOUND,
			});
			return;
		}

		const observeTargets = this.getObserveTargets();

		const query = this.config.nestedElementQuery;

		const subtree = this.config.type === 'inline' && this.config.subtree === true;
		const observe = (el: HTMLElement) => {
			const observer = new MutationObserver(onMutation);
			observer.observe(el, { childList: true, subtree });
			this.observers.push(observer);
		};

		const onMutation = (mutations: MutationRecord[]) => {
			const found = mutations.some(
				({ type, addedNodes }) =>
					type === 'childList' &&
					[...addedNodes].some(
						(node) =>
							node instanceof HTMLElement &&
							(popupWithNestedElement(node, query) ||
								node.matches(query) ||
								node.querySelector(query) !== null),
					),
			);

			if (found) {
				callback({ status: 'success' });
				return;
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
