import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { TableCssClassName as ClassName } from '../types';

type SentinelState = 'above' | 'visible' | 'below';

export class TableStickyScrollbar {
	private wrapper: HTMLDivElement;
	private view: EditorView;
	private editorScrollableElement?: HTMLElement | Document;
	private intersectionObserver?: IntersectionObserver;
	private stickyScrollbarContainerElement?: HTMLDivElement | null;

	private sentinels: {
		bottom?: HTMLElement | null;
		top?: HTMLElement | null;
	} = {};

	private topSentinelState?: SentinelState;
	private bottomSentinelState?: SentinelState;

	constructor(wrapper: HTMLDivElement, view: EditorView) {
		this.wrapper = wrapper;
		this.view = view;

		if (editorExperiment('platform_editor_exp_lazy_node_views', true)) {
			requestAnimationFrame(() => {
				this.init();
			});
		} else {
			this.init();
		}
	}

	dispose() {
		if (this.stickyScrollbarContainerElement) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			this.stickyScrollbarContainerElement.removeEventListener('scroll', this.handleScroll);
		}

		this.deleteIntersectionObserver();
	}

	scrollLeft(left: number) {
		if (this.stickyScrollbarContainerElement) {
			this.stickyScrollbarContainerElement.scrollLeft = left;
		}
	}

	private init() {
		if (!this.wrapper) {
			return;
		}

		this.stickyScrollbarContainerElement = this.wrapper.parentElement?.querySelector(
			`.${ClassName.TABLE_STICKY_SCROLLBAR_CONTAINER}`,
		);

		if (this.stickyScrollbarContainerElement) {
			// Ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			this.stickyScrollbarContainerElement.addEventListener('scroll', this.handleScroll, {
				passive: true,
			});
		}

		this.createIntersectionObserver();
	}

	private createIntersectionObserver() {
		this.editorScrollableElement =
			// Ignored via go/ees005
			// eslint-disable-next-line @atlaskit/editor/no-as-casting
			(findOverflowScrollParent(this.view.dom) as HTMLElement) || window.document;

		if (!this.editorScrollableElement || !this.wrapper) {
			return;
		}

		this.intersectionObserver = new IntersectionObserver(
			(entries: IntersectionObserverEntry[], _: IntersectionObserver) => {
				if (!this.stickyScrollbarContainerElement) {
					return;
				}

				entries.forEach((entry) => {
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					const target = entry.target as HTMLElement;
					// if the rootBounds has 0 height, e.g. confluence preview mode, we do nothing.
					if (entry.rootBounds?.height === 0) {
						return;
					}

					if (target.classList.contains(ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM)) {
						this.sentinelBottomCallback(entry);
					}

					if (target.classList.contains(ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_TOP)) {
						this.sentinelTopCallback(entry);
					}
				});
			},
			{ root: this.editorScrollableElement },
		);

		// Multiple bottom sentinels may be found if there are nested tables. We need to make sure we get the last one which will belong to the parent table.
		const bottomSentinels = this.wrapper?.parentElement?.getElementsByClassName(
			ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM,
		);

		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		this.sentinels.bottom = bottomSentinels?.item(bottomSentinels.length - 1) as HTMLElement;

		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		this.sentinels.top = this.wrapper?.parentElement
			?.getElementsByClassName(ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_TOP)
			?.item(0) as HTMLElement;

		[this.sentinels.bottom, this.sentinels.top].forEach((el) => {
			if (el !== null && this.intersectionObserver) {
				this.intersectionObserver.observe(el);
			}
		});
	}

	private deleteIntersectionObserver() {
		if (this.intersectionObserver) {
			if (this.sentinels.bottom) {
				this.intersectionObserver.unobserve(this.sentinels.bottom);
			}
			this.intersectionObserver.disconnect();
		}
	}

	private sentinelBottomCallback(entry: IntersectionObserverEntry) {
		const sentinelIsAboveScrollArea =
			entry.boundingClientRect.top < (entry.rootBounds?.top || 0) ||
			// When editorScrollableElement is the root document or inside modal,
			// so the boundingClientRect.top will never be less than the rootBounds.top,
			// so we need to check if the boundingClientRect.top is less than 20% of the rootBounds.height
			// to determine if the bottom sentinel is above the scroll area
			(entry.boundingClientRect.top < (entry.rootBounds?.height || 0) * 0.2 &&
				fg('platform_editor_scroll_table_flickering_fix'));

		this.bottomSentinelState = sentinelIsAboveScrollArea
			? 'above'
			: entry.isIntersecting
				? 'visible'
				: 'below';

		this.toggle();
	}

	private sentinelTopCallback(entry: IntersectionObserverEntry) {
		const sentinelIsBelowScrollArea =
			(entry.rootBounds?.bottom || 0) < entry.boundingClientRect.top;

		this.topSentinelState = sentinelIsBelowScrollArea
			? 'below'
			: entry.isIntersecting
				? 'visible'
				: 'above';

		this.toggle();
	}

	private toggle() {
		if (
			(this.topSentinelState === 'visible' || this.topSentinelState === 'above') &&
			this.bottomSentinelState === 'below'
		) {
			this.show();
		} else {
			this.hide();
		}
	}

	private hide() {
		if (
			this.stickyScrollbarContainerElement &&
			this.stickyScrollbarContainerElement.style.display !== 'none'
		) {
			this.stickyScrollbarContainerElement.style.display = 'none';
		}
	}

	private show() {
		if (
			this.stickyScrollbarContainerElement &&
			this.stickyScrollbarContainerElement.style.display !== 'block'
		) {
			this.stickyScrollbarContainerElement.style.display = 'block';
		}
	}

	private handleScroll = (event: Event) => {
		if (
			!this.stickyScrollbarContainerElement ||
			!this.wrapper ||
			event.target !== this.stickyScrollbarContainerElement
		) {
			return;
		}

		this.wrapper.scrollLeft = this.stickyScrollbarContainerElement.scrollLeft;
	};
}
