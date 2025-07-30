const GLOBAL_RLL_HANDLERS_KEY = '__REACT_UFO_RLL_PLACEHOLDER_HANDLERS__';

export class RLLPlaceholderHandlers {
	private placeholders: DOMRect[] = [];

	private constructor() {
		if (
			typeof window !== 'undefined' &&
			typeof document !== 'undefined' &&
			typeof window.document !== 'undefined'
		) {
			this.collectRLLPlaceholders();
		}
	}

	/**
	 * Gets the global singleton instance of RLLPlaceholderHandlers.
	 * Creates the instance if it doesn't exist and stores it in globalThis.
	 * @returns The singleton instance of RLLPlaceholderHandlers
	 */
	public static getInstance(): RLLPlaceholderHandlers {
		if (typeof globalThis !== 'undefined') {
			if (!(globalThis as any)[GLOBAL_RLL_HANDLERS_KEY]) {
				(globalThis as any)[GLOBAL_RLL_HANDLERS_KEY] = new RLLPlaceholderHandlers();
			}
			return (globalThis as any)[GLOBAL_RLL_HANDLERS_KEY];
		}

		// Fallback for environments without globalThis (should be rare)
		return new RLLPlaceholderHandlers();
	}

	public reset(): void {
		this.placeholders = [];
	}

	/**
	 * Collects all React Loosely Lazy (RLL) placeholders from the DOM and caches their viewport intersecting rectangles.
	 * RLL placeholders are marked with data-lazy-begin and data-lazy-end attributes on hidden input elements.
	 * Performance optimized to batch getBoundingClientRect calls and minimize layout thrashing.
	 * Only stores the intersecting portions of rectangles that are currently visible in the viewport.
	 */
	public collectRLLPlaceholders(): void {
		if (
			typeof window === 'undefined' ||
			typeof document === 'undefined' ||
			typeof window.document === 'undefined'
		) {
			return;
		}

		const beginElements = document.querySelectorAll('input[data-lazy-begin]');
		const beginCount = beginElements.length;

		if (beginCount === 0) {
			return;
		}

		// Performance optimization: pre-allocate array with estimated size
		const allElements: Element[] = [];

		// Performance optimization: use traditional for loop instead of forEach
		for (let i = 0; i < beginCount; i++) {
			const beginEl = beginElements[i];
			const id = beginEl.getAttribute('data-lazy-begin');
			if (!id) {
				continue;
			}

			const elements = this.refElements(beginEl as HTMLInputElement, id);
			if (elements.length > 0) {
				allElements.push(...elements);
			}
		}

		// Second pass: batch all getBoundingClientRect calls to minimize reflow cycles
		const allElementsLength = allElements.length;
		if (allElementsLength > 0) {
			// Performance optimization: pre-allocate array with exact size
			const intersectingRects: DOMRect[] = [];
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			for (let i = 0; i < allElementsLength; i++) {
				const rect = allElements[i].getBoundingClientRect();

				// Performance optimization: inline intersection calculation to avoid function call overhead
				const left = Math.max(rect.left, 0);
				const top = Math.max(rect.top, 0);
				const right = Math.min(rect.right, windowWidth);
				const bottom = Math.min(rect.bottom, windowHeight);

				// Check if there's a valid intersection with non-zero width and height
				if (left < right && top < bottom) {
					intersectingRects.push(new DOMRect(left, top, right - left, bottom - top));
				}
			}

			this.placeholders = intersectingRects;
		}
	}

	/**
	 * Traverses DOM siblings to find all elements between RLL begin and end markers.
	 * Based on the refElements pattern from react-loosely-lazy's platform/packages/async/react-loosely-lazy/src/collect/hydrate.ts
	 * Performance optimized to minimize iterations and early exit conditions.
	 *
	 * @param fromEl - The input element with data-lazy-begin attribute
	 * @param id - The placeholder ID to match against data-lazy-end
	 * @returns Array of DOM elements between the begin/end markers
	 */
	private refElements(fromEl: HTMLInputElement, id: string): Element[] {
		const result: Element[] = [];
		let el: (ChildNode & { readonly dataset?: DOMStringMap }) | null = fromEl.nextSibling;

		// Performance optimization: use while loop instead of recursive calls
		while (el) {
			if (el.dataset?.lazyEnd === id) {
				break;
			}

			if (el.nodeType === Node.ELEMENT_NODE) {
				result.push(el as Element);
			}

			el = el.nextSibling;
		}

		return result;
	}

	/**
	 * Returns the cached intersecting viewport rectangles for all RLL placeholder elements.
	 * @returns Array of DOMRect objects representing the intersecting portions of placeholders within the viewport
	 */
	public getPlaceholders(): DOMRect[] {
		return this.placeholders;
	}

	/**
	 * Checks if the given intersecting rectangle matches any of the cached RLL placeholder intersecting rectangles.
	 * This is designed to be called from IntersectionObserver with the intersectionRect.
	 * Performance optimized with early exits and minimal calculations.
	 * @param intersectingRect - The intersecting rectangle from IntersectionObserver
	 * @returns true if the intersecting rectangle matches a cached placeholder rectangle and hasn't exceeded match limit, false otherwise
	 */
	public isRLLPlaceholderHydration(intersectingRect: DOMRect): boolean {
		const placeholdersLength = this.placeholders.length;
		if (placeholdersLength === 0) {
			return false;
		}

		// Performance optimization: cache array length and use traditional for loop
		for (let i = 0; i < placeholdersLength; i++) {
			const placeholderRect = this.placeholders[i];
			if (this.areRectsEqual(intersectingRect, placeholderRect)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Compares two DOMRect objects for equality with ±1 pixel tolerance.
	 * Performance optimized to minimize calculations and early exit on major differences.
	 * @param rect1 - First rectangle to compare
	 * @param rect2 - Second rectangle to compare
	 * @returns true if rectangles are within 1 pixel tolerance for all properties
	 */
	private areRectsEqual(rect1: DOMRect, rect2: DOMRect): boolean {
		// Early exit for exact matches (most common case)
		if (
			rect1.left === rect2.left &&
			rect1.top === rect2.top &&
			rect1.right === rect2.right &&
			rect1.bottom === rect2.bottom
		) {
			return true;
		}

		// Performance optimization: check largest differences first for early exit
		const leftDiff = rect1.left - rect2.left;
		if (leftDiff > 1 || leftDiff < -1) {
			return false;
		}

		const rightDiff = rect1.right - rect2.right;
		if (rightDiff > 1 || rightDiff < -1) {
			return false;
		}

		const topDiff = rect1.top - rect2.top;
		if (topDiff > 1 || topDiff < -1) {
			return false;
		}

		const bottomDiff = rect1.bottom - rect2.bottom;
		if (bottomDiff > 1 || bottomDiff < -1) {
			return false;
		}

		return true;
	}
}
