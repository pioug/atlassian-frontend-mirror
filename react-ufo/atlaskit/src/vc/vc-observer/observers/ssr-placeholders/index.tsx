const ANCESTOR_LOOKUP_LIMIT = 10;
const PAGE_LAYOUT_ID = 'page-layout.root';

type Rect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export class SSRPlaceholderHandlers {
	private staticPlaceholders = new Map<string, Rect>();
	private callbacks = new Map<string, (resolve: boolean) => void>();
	private getSizeCallbacks = new Map<string, (resolve: Rect) => void>();
	private reactValidateCallbacks = new Map<string, (resolve: boolean) => void>();
	private intersectionObserver: IntersectionObserver | undefined;
	private EQUALITY_THRESHOLD = 1;
	private enablePageLayoutPlaceholder;

	constructor(enablePageLayoutPlaceholder = false) {
		if (typeof IntersectionObserver === 'function') {
			// Only instantiate the IntersectionObserver if it's supported
			this.intersectionObserver = new IntersectionObserver((entries) =>
				entries
					.filter((entry) => entry.intersectionRatio > 0)
					.forEach(this.intersectionObserverCallback),
			);
		}

		this.enablePageLayoutPlaceholder = enablePageLayoutPlaceholder;

		if (window.document) {
			try {
				const selector = this.enablePageLayoutPlaceholder ? '[data-ssr-placeholder],[data-testid="page-layout.root"]' : '[data-ssr-placeholder]'
				const existingElements = document.querySelectorAll(selector);
				existingElements.forEach((el) => {
					const placeholderId = el instanceof HTMLElement && this.getPlaceholderId(el);
					if (placeholderId) {
						let width = -1;
						let height = -1;
						let x = -1;
						let y = -1;
						const boundingClientRect =
							window.__SSR_PLACEHOLDERS_DIMENSIONS__?.[placeholderId];
						if (boundingClientRect) {
							width = boundingClientRect.width;
							height = boundingClientRect.height;
							x = boundingClientRect.x;
							y = boundingClientRect.y;
						}
						this.staticPlaceholders.set(placeholderId, {
							width,
							height,
							x,
							y,
						});
						this.intersectionObserver?.observe(el);
					}
				});
			} catch (e) {
			} finally {
				delete window.__SSR_PLACEHOLDERS_DIMENSIONS__;
			}
		}
	}

	private getPlaceholderId = (el?: HTMLElement): string => {
		const ssrPlaceholderId = el?.dataset?.ssrPlaceholder;
		if (!!ssrPlaceholderId) {
			return ssrPlaceholderId;
		}
		if (this.enablePageLayoutPlaceholder && el?.dataset.testid === PAGE_LAYOUT_ID) {
			return PAGE_LAYOUT_ID;
		}
		return '';
	}

	private getPlaceholderReplacementId = (el?: HTMLElement): string => {
		const ssrPlaceholderReplaceId = el?.dataset?.ssrPlaceholderReplace;
		if (!!ssrPlaceholderReplaceId) {
			return ssrPlaceholderReplaceId;
		}
		if (this.enablePageLayoutPlaceholder && el?.dataset.testid === PAGE_LAYOUT_ID) {
			return PAGE_LAYOUT_ID;
		}
		return '';
	}

	clear() {
		this.staticPlaceholders = new Map();
		this.callbacks = new Map();
		this.getSizeCallbacks = new Map();
		this.reactValidateCallbacks = new Map();
	}

	isPlaceholder(element: HTMLElement) {
		return Boolean(this.getPlaceholderId(element));
	}

	isPlaceholderReplacement(element: HTMLElement) {
		return Boolean(this.getPlaceholderReplacementId(element));
	}

	isPlaceholderIgnored(element: HTMLElement) {
		// data-ssr-placeholder-ignored doesn't have a value.
		return 'ssrPlaceholderIgnored' in element.dataset;
	}

	findNearestPlaceholderContainerIfIgnored(element: HTMLElement) {
		if (!this.isPlaceholderIgnored(element)) {
			return element;
		}

		let ancestor = element.parentElement;
		let i = 0;
		while (ancestor && i < ANCESTOR_LOOKUP_LIMIT) {
			if (this.isPlaceholder(ancestor) || this.isPlaceholderReplacement(ancestor)) {
				return ancestor;
			}
			ancestor = ancestor.parentElement;
			i++;
		}
		return element;
	}

	checkIfExistedAndSizeMatching(el: HTMLElement) {
		el = this.findNearestPlaceholderContainerIfIgnored(el);
		const id = this.getPlaceholderId(el);
		return new Promise((resolve) => {
			if (!this.staticPlaceholders.has(id)) {
				resolve(false);
				return;
			} else {
				this.callbacks.set(id, resolve);
				this.intersectionObserver?.observe(el);
			}
		});
	}

	getSize(el: HTMLElement): Promise<Rect> {
		return new Promise((resolve) => {
			this.getSizeCallbacks.set(this.getPlaceholderId(el), resolve);
			this.intersectionObserver?.observe(el);
		});
	}

	validateReactComponentMatchToPlaceholder(el: HTMLElement) {
		el = this.findNearestPlaceholderContainerIfIgnored(el);
		const id = this.getPlaceholderReplacementId(el);
		return new Promise((resolve) => {
			if (!this.staticPlaceholders.has(id)) {
				resolve(false);
				return;
			} else {
				this.reactValidateCallbacks.set(id, resolve);
				this.intersectionObserver?.observe(el);
			}
		});
	}

	hasSameSizePosition(rect: Rect | undefined, boundingClientRect: DOMRectReadOnly) {
		return (
			(rect &&
				Math.abs(rect.x - boundingClientRect.x) < this.EQUALITY_THRESHOLD &&
				Math.abs(rect.y - boundingClientRect.y) < this.EQUALITY_THRESHOLD &&
				Math.abs(rect.width - boundingClientRect.width) < this.EQUALITY_THRESHOLD &&
				Math.abs(rect.height - boundingClientRect.height) < this.EQUALITY_THRESHOLD) ||
			false
		);
	}

	isDummyRect(rect: Rect | undefined) {
		return (rect && rect.width < 0 && rect.height < 0) || false;
	}

	intersectionObserverCallback = ({ target, boundingClientRect }: IntersectionObserverEntry) => {
		this.intersectionObserver?.unobserve(target);
		if (!(target instanceof HTMLElement)) {
			// impossible case - keep typescript healthy
			return;
		}
		const staticKey = this.getPlaceholderId(target);
		if (staticKey) {
			if (this.staticPlaceholders.has(staticKey) && this.callbacks.has(staticKey)) {
				// validation
				const resolve = this.callbacks.get(staticKey);
				if (!resolve) {
					return;
				}

				const rect = this.staticPlaceholders.get(staticKey);

				const hasSameSizePosition = this.hasSameSizePosition(rect, boundingClientRect);
				if (hasSameSizePosition || this.isDummyRect(rect)) {
					resolve(hasSameSizePosition);
				} else {
					requestAnimationFrame(() => {
						const targetRect = target.getBoundingClientRect();
						const hasSameSizePosition = this.hasSameSizePosition(rect, targetRect);
						resolve(hasSameSizePosition);
					});
				}

				this.callbacks.delete(staticKey);
			}
		} else {
			const key = this.getPlaceholderReplacementId(target);

			const resolve = this.reactValidateCallbacks.get(key);
			if (!resolve) {
				return;
			}

			const rect = this.staticPlaceholders.get(key);
			const hasSameSizePosition = this.hasSameSizePosition(rect, boundingClientRect);
			if (hasSameSizePosition || this.isDummyRect(rect)) {
				resolve(hasSameSizePosition);
			} else {
				requestAnimationFrame(() => {
					const targetRect = target.getBoundingClientRect();
					const hasSameSizePosition = this.hasSameSizePosition(rect, targetRect);
					resolve(hasSameSizePosition);
				});
			}

			this.staticPlaceholders.delete(staticKey);
			this.reactValidateCallbacks.delete(staticKey);
		}
	};
}
