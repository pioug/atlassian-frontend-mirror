import { getDocument } from '@atlaskit/browser-apis';
import type {
	ExperienceCheck,
	ExperienceCheckCallback,
	ExperienceCheckResult,
} from '@atlaskit/editor-common/experiences';
import {
	EXPERIENCE_FAILURE_REASON,
	popupWithNestedElement,
} from '@atlaskit/editor-common/experiences';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

/**
 * Popup check type determines how popups are observed based on their DOM location:
 * - 'inline': Popups appearing in toolbar button-groups (emoji, media, table selector, image)
 * - 'editorRoot': Popups attached to editor root (e.g., mention popups)
 * - 'editorContent': Content-level popups or modals in portal containers (e.g., block menu)
 */
export type PopupCheckType = 'inline' | 'editorRoot' | 'editorContent';

/**
 * DOM marker selectors for node types inserted via toolbar actions.
 * Matches outermost wrapper elements set synchronously by ReactNodeView
 * (`{nodeTypeName}View-content-wrap`) or schema `toDOM` attributes.
 */
export const NODE_INSERT_MARKERS = {
	TABLE: '.tableView-content-wrap',
	LAYOUT: '.layoutSectionView-content-wrap',
	LAYOUT_COLUMN: '.layoutColumnView-content-wrap',
	TASK_LIST: '[data-node-type="actionList"]',
	TASK_ITEM: '.taskItemView-content-wrap',
} as const;

const COMBINED_NODE_INSERT_SELECTOR = [
	NODE_INSERT_MARKERS.TABLE,
	NODE_INSERT_MARKERS.LAYOUT,
	NODE_INSERT_MARKERS.LAYOUT_COLUMN,
	NODE_INSERT_MARKERS.TASK_LIST,
	NODE_INSERT_MARKERS.TASK_ITEM,
].join(', ');

export const isToolbarButtonClick = (target: HTMLElement, testId: string): boolean => {
	const button = target.closest<HTMLButtonElement>(`button[data-testid="${testId}"]`);
	if (!button) {
		return false;
	}
	return !button.disabled && button.getAttribute('aria-disabled') !== 'true';
};

export class ExperienceCheckPopupMutation implements ExperienceCheck {
	private nestedElementQuery: string;
	private getTarget: () => HTMLElement | undefined | null;
	private getEditorDom: () => HTMLElement | undefined | null;
	private type: PopupCheckType;
	private observers: MutationObserver[] = [];

	constructor(
		nestedElementQuery: string,
		getTarget: () => HTMLElement | undefined | null,
		getEditorDom: () => HTMLElement | undefined | null,
		type: PopupCheckType = 'editorRoot',
	) {
		this.nestedElementQuery = nestedElementQuery;
		this.getTarget = getTarget;
		this.getEditorDom = getEditorDom;
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
		}
		// Should never reach here - all types handled above
		return [];
	}

	/**
	 * For 'inline' type: observe only the button-group container.
	 * The target passed in should be the button-group (or button within it) from getInlinePopupTarget().
	 * Inline popups appear as direct children of button-group elements.
	 */
	private getInlineTargets(): HTMLElement[] {
		const target = this.getTarget();

		if (!target) {
			return [];
		}

		// Walk up to find the button-group container
		const buttonGroup = target.closest<HTMLElement>('[data-toolbar-component="button-group"]');

		// Target is already the button-group or button from getInlinePopupTarget()
		// Just observe this single element
		return buttonGroup ? [buttonGroup, target] : [target];
	}

	/**
	 * For 'editorRoot' type: observe the actual editor root container.
	 * The editorDom is the ProseMirror element, but popups appear as direct children
	 * of the parent .akEditor container. So we observe the parent of editorDom.
	 * No portal observation needed.
	 */
	private getEditorRootTargets(): HTMLElement[] {
		const targets: HTMLElement[] = [];
		const editorDom = this.getEditorDom();

		if (editorDom) {
			// Find the actual editor root (.akEditor) by walking up the DOM
			const editorRoot = editorDom.closest('.akEditor') || editorDom.parentElement;

			if (editorRoot instanceof HTMLElement) {
				targets.push(editorRoot);

				// Observe existing [data-editor-popup] wrappers
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
		if (!target) {
			callback({
				status: 'failure',
				reason: EXPERIENCE_FAILURE_REASON.DOM_MUTATION_TARGET_NOT_FOUND,
			});
			return;
		}

		const doc = getDocument();
		if (!doc) {
			callback({
				status: 'failure',
				reason: EXPERIENCE_FAILURE_REASON.DOM_MUTATION_TARGET_NOT_FOUND,
			});
			return;
		}

		const query = this.nestedElementQuery;

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
						this.stop();
						callback({ status: 'success' });
						return;
					}
				}
			}
		};

		const observe = (el: HTMLElement) => {
			const observer = new MutationObserver(onMutation);
			observer.observe(el, { childList: true });
			this.observers.push(observer);
		};

		// Get type-specific targets and observe them
		const observeTargets = this.getObserveTargets();
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

/**
 * Returns the narrow parent DOM element at the current selection, suitable
 * for observing with `{ childList: true }` (no subtree).
 *
 * Uses the resolved position's depth to find the block node at the cursor
 * via `nodeDOM`, then returns its `parentElement` — the container whose
 * direct children change when content is inserted at this position.
 *
 * Falls back to `domAtPos` if `nodeDOM` is unavailable.
 */
export const getParentDOMAtSelection = (editorView?: EditorView): HTMLElement | null => {
	if (!editorView) {
		return null;
	}

	try {
		const { selection } = editorView.state;
		const $from = selection.$from;
		const parentDepth = Math.max(1, $from.depth);
		const parentPos = $from.before(parentDepth);
		const parentDom = editorView.nodeDOM(parentPos);

		if (parentDom instanceof HTMLElement && parentDom.parentElement) {
			return parentDom.parentElement;
		}

		// Fallback: use domAtPos
		const { node } = editorView.domAtPos(selection.from);
		let element: HTMLElement | null = null;
		if (node instanceof HTMLElement) {
			element = node;
		} else if (node instanceof Text) {
			element = node.parentElement;
		}

		if (!element) {
			return null;
		}

		const proseMirrorRoot = editorView.dom;
		if (!(proseMirrorRoot instanceof HTMLElement)) {
			return null;
		}

		if (element === proseMirrorRoot) {
			return proseMirrorRoot;
		}

		if (element.parentElement && proseMirrorRoot.contains(element.parentElement)) {
			return element.parentElement;
		}

		return proseMirrorRoot;
	} catch {
		return null;
	}
};

/**
 * Checks whether a DOM node matches any known node insert marker,
 * either directly or via a nested element (e.g. breakout mark wrapper).
 */
const matchesNodeInsertMarker = (node: Node): boolean => {
	if (!(node instanceof HTMLElement)) {
		return false;
	}
	return (
		node.matches(COMBINED_NODE_INSERT_SELECTOR) ||
		!!node.querySelector(COMBINED_NODE_INSERT_SELECTOR)
	);
};

/**
 * Evaluates DOM mutations to detect a node insert action.
 *
 * Uses two strategies:
 * 1. Marker-based: checks `addedNodes` against known node insert selectors.
 * 2. Structure-based: detects element add+remove (block-level replacement).
 */
export const handleEditorNodeInsertDomMutation = ({
	mutations,
}: {
	mutations: MutationRecord[];
}): ExperienceCheckResult | undefined => {
	let hasAddedElement = false;
	let hasRemovedElement = false;

	for (const mutation of mutations) {
		if (mutation.type !== 'childList') {
			continue;
		}

		for (const node of mutation.addedNodes) {
			if (matchesNodeInsertMarker(node)) {
				return { status: 'success' };
			}
			if (node instanceof HTMLElement) {
				hasAddedElement = true;
			}
		}

		for (const node of mutation.removedNodes) {
			if (node instanceof HTMLElement) {
				hasRemovedElement = true;
			}
		}
	}

	if (hasAddedElement && hasRemovedElement) {
		return { status: 'success' };
	}

	return undefined;
};
