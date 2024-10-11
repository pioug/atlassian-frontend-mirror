import memoizeOne from 'memoize-one';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export const isAnchorSupported = memoizeOne(() => {
	// directly use CSS would cause failed SSR tests.
	if (window.CSS && window.CSS.supports) {
		return window.CSS.supports('anchor-name: --a');
	}
	return false;
});

export class AnchorHeightsCache {
	private anchorHeightsMap: { [key: string]: number } = {};
	private isAnchorSupported = isAnchorSupported();
	private isDirty = true;
	private view: EditorView | null = null;

	public clear() {
		this.isDirty = true;
		this.anchorHeightsMap = {};
	}

	private getHeights() {
		if (this.isDirty) {
			const anchorElements =
				this.view?.dom.querySelectorAll('[data-drag-handler-anchor-name]') || [];
			this.anchorHeightsMap = Array.from(anchorElements).reduce((prev, curr) => {
				const anchorName = curr.getAttribute('data-drag-handler-anchor-name');

				if (anchorName) {
					return {
						...prev,
						[anchorName]: curr.clientHeight,
					};
				}

				return prev;
			}, {});

			this.isDirty = false;
		}

		return this.anchorHeightsMap;
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

		const heights = this.getHeights();
		return heights[anchorName];
	}
}
