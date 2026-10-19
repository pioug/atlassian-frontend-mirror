import { tableMarginTop } from '@atlaskit/editor-common/styles/table';
import { getStickyHeaderHeight } from '@atlaskit/editor-common/table/get-sticky-header-height';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { EditorView, Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { ShowDiffPlugin } from '../showDiffPluginType';
import { isDiffDecoration, SCROLL_TARGET_MARGIN_CSS_PROPERTY } from './decorations/decorationKeys';
import { getWidgetElement } from './decorations/utils/getWidgetElement';

/**
 * Extra space above the scrolled-to element so it does not sit flush under the
 * viewport edge (helps with sticky table headers, toolbars, etc.).
 *
 * Implemented with `scroll-margin-top` so we still use the browser’s native
 * `scrollIntoView`, which scrolls every relevant scrollport (nested containers
 * and the window). A single manual `scrollTop` on one ancestor often misses
 * outer scroll or mis-identifies the active scroll container.
 */
const SCROLL_TOP_MARGIN_PX = 100;

type PluginInjectionAPI = ExtractInjectionAPI<ShowDiffPlugin>;

function updateScrollTargetMargin(
	view: EditorView,
	targetPos: number,
	api: PluginInjectionAPI | undefined,
): void {
	const isLimitedModeEnabled = Boolean(api?.limitedMode?.sharedState.currentState()?.enabled);

	const tableHeaderHeight = isLimitedModeEnabled
		? undefined
		: getStickyHeaderHeight(view, targetPos);
	view.dom.style.setProperty(
		SCROLL_TARGET_MARGIN_CSS_PROPERTY,
		`${tableHeaderHeight ? tableHeaderHeight + tableMarginTop : 0}px`,
	);
}

function scrollToSelection(node: Node | null | undefined): void {
	// ProseMirror may return a text node; scroll its parent element instead.
	const element = node instanceof Element ? node : node?.parentElement;
	if (!(element instanceof HTMLElement)) {
		return;
	}
	const scrollOptions: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' };
	if (fg('platform_editor_ai_suggestion_table_scroll_fix')) {
		scrollOptions.inline = 'center';
	}
	if (fg('platform_editor_ai_show_diff_patch_1')) {
		element.scrollIntoView(scrollOptions);
		return;
	}

	// scroll-margin is included in scroll-into-view math; it does not change layout.
	const previousScrollMarginTop = element.style.scrollMarginTop;
	element.style.scrollMarginTop = `${SCROLL_TOP_MARGIN_PX}px`;
	try {
		element.scrollIntoView(scrollOptions);
	} finally {
		element.style.scrollMarginTop = previousScrollMarginTop;
	}
}

function resolveScrollTarget(view: EditorView, target: Decoration): Node | null | undefined {
	if (isDiffDecoration(target) && target.spec.decorationType === 'widget') {
		return getWidgetElement(target);
	}
	if (isDiffDecoration(target) && fg('platform_editor_ai_show_diff_patch_2')) {
		return (
			Array.from(view.dom.querySelectorAll<HTMLElement>('[data-diff-id]')).find(
				(element) => element.dataset.diffId === target.spec.diffId,
			) ?? view.nodeDOM(target.from)
		);
	}

	const targetNode = view.nodeDOM(target.from);
	return targetNode instanceof Element ? targetNode : view.domAtPos(target.from)?.node;
}

/**
 * Schedules scrolling to the decoration at the given index after the next frame. Defaults to the
 * first decoration when no index is provided.
 *
 * @returns A function that cancels the scheduled `requestAnimationFrame` if it has not run yet.
 */
export const scrollToDecoration = (
	view: EditorView,
	decorations: Decoration[],
	activeIndex: number = 0,
	api?: PluginInjectionAPI,
): (() => void) => {
	const decoration = decorations[activeIndex];
	if (!decoration) {
		return () => {};
	}

	// A grouped decoration spans a whole customer-facing edit, which can visually start with a
	// deleted-content widget rather than at the group's `from` position — see `scrollTarget` in
	// `getScrollableDecorations`. Only set under `platform_editor_ai_show_diff_patch_1`.
	const target = (isDiffDecoration(decoration) && decoration.spec.scrollTarget) || decoration;

	let rafId: number | null = null;
	let cancelled = false;

	const scrollToTarget = () => {
		if (view.isDestroyed) {
			return;
		}
		if (fg('platform_editor_ai_show_diff_patch_1')) {
			updateScrollTargetMargin(view, target.from, api);
		}
		scrollToSelection(resolveScrollTarget(view, target));
	};

	// Called from the plugin's post-DOM update hook; defer measurement until layout can settle.
	rafId = requestAnimationFrame(() => {
		rafId = null;
		if (!cancelled) {
			scrollToTarget();
		}
	});

	return () => {
		cancelled = true;
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
			rafId = null;
		}
	};
};
