import { BreakoutCssClassName } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

import { BreakoutPlugin } from '../breakoutPluginType';

import { createPragmaticResizer } from './pragmatic-resizer';
import { createResizerCallbacks } from './resizer-callbacks';

export const LOCAL_RESIZE_PROPERTY = '--local-resizing-width';

export class ResizingMarkView implements NodeView {
	dom: HTMLElement;
	contentDOM: HTMLElement;
	view: EditorView;
	mark: Mark;
	destroyFn: () => void;

	/**
	 * Wrap node view in a resizing mark view
	 * @param {Mark} mark - The breakout mark to resize
	 * @param {EditorView} view - The editor view
	 * @param {ExtractInjectionAPI<BreakoutPlugin> | undefined} api - the pluginInjectionAPI
	 * @example
	 * ```ts
	 * ```
	 */
	constructor(mark: Mark, view: EditorView, api: ExtractInjectionAPI<BreakoutPlugin> | undefined) {
		const dom = document.createElement('div');
		const contentDOM = document.createElement('div');
		contentDOM.className = BreakoutCssClassName.BREAKOUT_MARK_DOM;
		contentDOM.setAttribute('data-testid', 'ak-editor-breakout-mark-dom');

		dom.className = BreakoutCssClassName.BREAKOUT_MARK;
		dom.setAttribute('data-layout', mark.attrs.mode);
		dom.setAttribute('data-testid', 'ak-editor-breakout-mark');
		// dom - styles
		dom.style.transform = 'none';
		dom.style.display = 'grid';
		dom.style.justifyContent = 'center';

		// contentDOM - styles
		contentDOM.style.gridRow = '1';
		contentDOM.style.gridColumn = '1';

		if (mark.attrs.width) {
			contentDOM.style.minWidth = `min(var(${LOCAL_RESIZE_PROPERTY}, ${mark.attrs.width}px), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding)))`;
		} else {
			if (mark.attrs.mode === 'wide') {
				contentDOM.style.minWidth = `max(var(--ak-editor--line-length), min(var(${LOCAL_RESIZE_PROPERTY}, var(--ak-editor--breakout-wide-layout-width)), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
			}
			if (mark.attrs.mode === 'full-width') {
				contentDOM.style.minWidth = `max(var(--ak-editor--line-length), min(var(${LOCAL_RESIZE_PROPERTY}, var(--ak-editor--full-width-layout-width)), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
			}
		}

		dom.appendChild(contentDOM);

		const callbacks = createResizerCallbacks({ dom, contentDOM, view, mark, api });
		const { leftHandle, rightHandle, destroy } = createPragmaticResizer(callbacks);

		dom.prepend(leftHandle);
		dom.appendChild(rightHandle);

		this.dom = dom;
		this.contentDOM = contentDOM;
		this.view = view;
		this.mark = mark;
		this.destroyFn = destroy;
	}

	ignoreMutation() {
		return true;
	}

	destroy() {
		this.destroyFn();
	}
}
