const ANCESTOR_LOOKUP_LIMIT = 10;

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

	constructor() {
		if (typeof IntersectionObserver === 'function') {
			// Only instantiate the IntersectionObserver if it's supported
			this.intersectionObserver = new IntersectionObserver((entries) =>
				entries
					.filter((entry) => entry.intersectionRatio > 0)
					.forEach(this.intersectionObserverCallback),
			);
		}

		if (window.document) {
			try {
				const existingElements = document.querySelectorAll('[data-ssr-placeholder]');
				existingElements.forEach((el) => {
					if (el instanceof HTMLElement && el?.dataset?.ssrPlaceholder) {
						let width = -1;
						let height = -1;
						let x = -1;
						let y = -1;
						const boundingClientRect =
							window.__SSR_PLACEHOLDERS_DIMENSIONS__?.[el.dataset.ssrPlaceholder];
						if (boundingClientRect) {
							width = boundingClientRect.width;
							height = boundingClientRect.height;
							x = boundingClientRect.x;
							y = boundingClientRect.y;
						}
						this.staticPlaceholders.set(el.dataset.ssrPlaceholder, {
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

	clear() {
		this.staticPlaceholders = new Map();
		this.callbacks = new Map();
		this.getSizeCallbacks = new Map();
		this.reactValidateCallbacks = new Map();
	}

	isPlaceholder(element: HTMLElement) {
		return Boolean(element.dataset.ssrPlaceholder);
	}

	isPlaceholderReplacement(element: HTMLElement) {
		return Boolean(element.dataset.ssrPlaceholderReplace);
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
		const id = el.dataset.ssrPlaceholder || '';
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
			this.getSizeCallbacks.set(el.dataset.ssrPlaceholder || '', resolve);
			this.intersectionObserver?.observe(el);
		});
	}

	validateReactComponentMatchToPlaceholder(el: HTMLElement) {
		el = this.findNearestPlaceholderContainerIfIgnored(el);
		const id = el.dataset.ssrPlaceholderReplace || '';
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
		const staticKey = target.dataset.ssrPlaceholder || '';
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
			const key = target.dataset.ssrPlaceholderReplace || '';

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
