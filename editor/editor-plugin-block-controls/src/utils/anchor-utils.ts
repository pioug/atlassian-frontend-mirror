import memoizeOne from 'memoize-one';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const isAnchorSupported = memoizeOne(() => {
	// directly use CSS would cause failed SSR tests.
	if (window.CSS && window.CSS.supports) {
		return window.CSS.supports('anchor-name: --a');
	}
	return false;
});

type RectInfo = {
	height: number;
	top: number;
	left: number;
	right: number;
	width: number;
};

export class AnchorRectCache {
	private anchorRectMap: { [key: string]: RectInfo } = {};
	private isAnchorSupported = isAnchorSupported();
	private isDirty = true;
	private view: EditorView | null = null;

	public clear() {
		this.isDirty = true;
		this.anchorRectMap = {};
	}

	private getRects() {
		if (this.isDirty) {
			const anchorElements: NodeListOf<HTMLElement> | never[] =
				this.view?.dom.querySelectorAll('[data-drag-handler-anchor-name]') || [];
			this.anchorRectMap = Array.from(anchorElements).reduce((prev, curr) => {
				const anchorName = curr.getAttribute('data-drag-handler-anchor-name');

				if (anchorName) {
					return {
						...prev,
						[anchorName]: {
							height: curr.clientHeight,
							top: curr.offsetTop,
							left: curr.offsetLeft,
							right: curr.offsetLeft + curr.clientWidth,
							width: curr.clientWidth,
						},
					};
				}

				return prev;
			}, {});

			this.isDirty = false;
		}

		return this.anchorRectMap;
	}

	public setEditorView(view: EditorView) {
		if (this.view !== view) {
			this.view = view;
		}
	}

	public getHeight(anchorName: string) {
		if (this.isAnchorSupported) {
			return null;
		}

		const rects = this.getRects();
		return rects[anchorName]?.height;
	}

	public getWidth(anchorName: string) {
		if (this.isAnchorSupported) {
			return null;
		}

		const rects = this.getRects();
		return rects[anchorName]?.width;
	}

	public getLeft(anchorName: string) {
		if (this.isAnchorSupported) {
			return null;
		}

		const rects = this.getRects();
		return rects[anchorName]?.left;
	}

	public getTop(anchorName: string) {
		if (this.isAnchorSupported) {
			return null;
		}

		const rects = this.getRects();
		return rects[anchorName]?.top;
	}

	public getRight(anchorName: string) {
		if (this.isAnchorSupported) {
			return null;
		}

		const rects = this.getRects();
		return rects[anchorName]?.right;
	}

	public getRect(anchorName: string) {
		if (this.isAnchorSupported) {
			return null;
		}

		const rects = this.getRects();
		return rects[anchorName];
	}
}
