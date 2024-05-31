import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

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

		this.init();
	}

	dispose() {
		if (this.stickyScrollbarContainerElement) {
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
			this.stickyScrollbarContainerElement.addEventListener('scroll', this.handleScroll, {
				passive: true,
			});
		}

		this.createIntersectionObserver();
	}

	private createIntersectionObserver() {
		this.editorScrollableElement =
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

		this.sentinels.bottom = this.wrapper?.parentElement
			?.getElementsByClassName(ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_BOTTOM)
			?.item(0) as HTMLElement;

		this.sentinels.top = this.wrapper?.parentElement
			?.getElementsByClassName(ClassName.TABLE_STICKY_SCROLLBAR_SENTINEL_TOP)
			?.item(0) as HTMLElement;

		[this.sentinels.bottom, this.sentinels.top].forEach((el) =>
			this.intersectionObserver!.observe(el),
		);
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
		const sentinelIsAboveScrollArea = entry.boundingClientRect.top < (entry.rootBounds?.top || 0);

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
