import { markProfilingEnd, markProfilingStart, withProfiling } from '../../../../self-measurements';

type HandlerResult = {
	shouldIgnore: boolean;
};

type Rect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

type PlaceholderId = string;

const placeholderDataKey = 'editorLnvPlaceholder'; // data-editor-lnv-placeholder
const replaceDataKey = 'editorLnvPlaceholderReplace'; // data-editor-lnv-placeholder-replace

export class EditorLnvHandler {
	private placeholders = new Map<PlaceholderId, Rect>();
	private intersectionObserver: IntersectionObserver;
	private getSizeCallbacks = new Map<PlaceholderId, (resolve: Rect) => void>();
	private isAddedPlaceholderMatchingSizeCallbacks = new Map<
		PlaceholderId,
		(resolve: boolean) => void
	>();
	private isAddedReplaceMatchingSizeCallbacks = new Map<
		PlaceholderId,
		(resolve: boolean) => void
	>();

	constructor() {
		const operationTimer = markProfilingStart('EditorLnvHandler constructor');
		this.intersectionObserver = new IntersectionObserver((entries) =>
			entries
				.filter((entry) => entry.intersectionRatio > 0)
				.forEach(this.intersectionObserverCallback),
		);
		this.shouldHandleAddedNode = withProfiling(this.shouldHandleAddedNode.bind(this), ['vc']);
		this.handleAddedNode = withProfiling(this.handleAddedNode.bind(this), ['vc']);
		this.clear = withProfiling(this.clear.bind(this), ['vc']);
		this.handleAddedPlaceholderNode = withProfiling(this.handleAddedPlaceholderNode.bind(this), [
			'vc',
		]);
		this.handleAddedReplaceNode = withProfiling(this.handleAddedReplaceNode.bind(this), ['vc']);
		this.isExistingPlaceholder = withProfiling(this.isExistingPlaceholder.bind(this), ['vc']);
		this.registerPlaceholder = withProfiling(this.registerPlaceholder.bind(this), ['vc']);
		this.getSize = withProfiling(this.getSize.bind(this), ['vc']);
		this.isAddedPlaceholderMatchingSize = withProfiling(
			this.isAddedPlaceholderMatchingSize.bind(this),
			['vc'],
		);
		this.isAddedReplaceMatchingSize = withProfiling(this.isAddedReplaceMatchingSize.bind(this), [
			'vc',
		]);
		this.areRectsSameSize = withProfiling(this.areRectsSameSize.bind(this), ['vc']);
		this.intersectionObserverCallback = withProfiling(
			this.intersectionObserverCallback.bind(this),
			['vc'],
		);
		markProfilingEnd(operationTimer, { tags: ['vc'] });
	}

	shouldHandleAddedNode(el: HTMLElement) {
		return el.dataset?.[placeholderDataKey] || el.dataset?.[replaceDataKey];
	}

	handleAddedNode(el: HTMLElement): Promise<HandlerResult> {
		// If it placeholder does not already exist, add it to the map
		const placeholderId = el.dataset?.[placeholderDataKey];
		if (placeholderId) {
			return this.handleAddedPlaceholderNode(el, placeholderId);
		}

		const replaceId = el.dataset?.[replaceDataKey];
		if (replaceId) {
			return this.handleAddedReplaceNode(el, replaceId);
		}

		return Promise.resolve({ shouldIgnore: false });
	}

	clear() {
		this.placeholders.clear();
		this.intersectionObserver.disconnect();
	}

	private handleAddedPlaceholderNode(
		el: HTMLElement,
		placeholderId: PlaceholderId,
	): Promise<HandlerResult> {
		if (this.isExistingPlaceholder(placeholderId)) {
			return this.isAddedPlaceholderMatchingSize(el, placeholderId).then((isMatching) => ({
				shouldIgnore: isMatching,
			}));
		}
		return this.registerPlaceholder(el, placeholderId).then(() => ({
			shouldIgnore: false,
		}));
	}

	private handleAddedReplaceNode(
		el: HTMLElement,
		placeholderId: PlaceholderId,
	): Promise<HandlerResult> {
		if (this.isExistingPlaceholder(placeholderId)) {
			return this.isAddedReplaceMatchingSize(el, placeholderId).then((isMatching) => ({
				shouldIgnore: isMatching,
			}));
		}

		return Promise.resolve({ shouldIgnore: false });
	}

	private isExistingPlaceholder(placeholderId: PlaceholderId) {
		return this.placeholders.has(placeholderId);
	}

	private registerPlaceholder(el: HTMLElement, placeholderId: PlaceholderId): Promise<void> {
		return this.getSize(el, placeholderId).then((size) => {
			this.placeholders.set(placeholderId, size);
		});
	}

	private getSize(el: HTMLElement, placeholderId: PlaceholderId): Promise<Rect> {
		return new Promise((resolve) => {
			this.getSizeCallbacks.set(placeholderId, resolve);
			this.intersectionObserver.observe(el);
		});
	}

	private isAddedPlaceholderMatchingSize(
		el: HTMLElement,
		placeholderId: PlaceholderId,
	): Promise<boolean> {
		return new Promise((resolve) => {
			this.isAddedPlaceholderMatchingSizeCallbacks.set(placeholderId, resolve);
			this.intersectionObserver.observe(el);
		});
	}

	private isAddedReplaceMatchingSize(
		el: HTMLElement,
		placeholderId: PlaceholderId,
	): Promise<boolean> {
		return new Promise((resolve) => {
			this.isAddedReplaceMatchingSizeCallbacks.set(placeholderId, resolve);
			this.intersectionObserver.observe(el);
		});
	}

	private areRectsSameSize(a: Rect, b: Rect) {
		return Math.abs(a.width - b.width) < 1 && Math.abs(a.height - b.height) < 1;
	}

	private intersectionObserverCallback = ({
		target,
		boundingClientRect,
	}: IntersectionObserverEntry) => {
		this.intersectionObserver.unobserve(target);
		if (!(target instanceof HTMLElement)) {
			return;
		}

		const placeholderId = target.dataset?.[placeholderDataKey];
		if (placeholderId && this.getSizeCallbacks.has(placeholderId)) {
			const resolve = this.getSizeCallbacks.get(placeholderId);
			this.getSizeCallbacks.delete(placeholderId);

			if (!resolve) {
				return;
			}

			resolve({
				x: boundingClientRect.x,
				y: boundingClientRect.y,
				width: boundingClientRect.width,
				height: boundingClientRect.height,
			});
			return;
		}

		if (placeholderId && this.isAddedPlaceholderMatchingSizeCallbacks.has(placeholderId)) {
			const resolve = this.isAddedPlaceholderMatchingSizeCallbacks.get(placeholderId);
			this.isAddedPlaceholderMatchingSizeCallbacks.delete(placeholderId);

			if (!resolve) {
				return;
			}

			const placeholder = this.placeholders.get(placeholderId);
			if (!placeholder) {
				resolve(false);
				return;
			}

			resolve(this.areRectsSameSize(placeholder, boundingClientRect));
			return;
		}

		const replaceId = target.dataset?.[replaceDataKey];
		if (replaceId && this.isAddedReplaceMatchingSizeCallbacks.has(replaceId)) {
			const resolve = this.isAddedReplaceMatchingSizeCallbacks.get(replaceId);
			this.isAddedReplaceMatchingSizeCallbacks.delete(replaceId);

			if (!resolve) {
				return;
			}

			const placeholder = this.placeholders.get(replaceId);
			if (!placeholder) {
				resolve(false);
				return;
			}

			this.placeholders.delete(replaceId);
			resolve(this.areRectsSameSize(placeholder, boundingClientRect));
			return;
		}
	};
}
