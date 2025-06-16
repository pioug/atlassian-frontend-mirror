import type { IntlShape } from 'react-intl-next';

import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { BreakoutCssClassName } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BreakoutPlugin } from '../breakoutPluginType';

import { createPragmaticResizer } from './pragmatic-resizer';
import { createResizerCallbacks } from './resizer-callbacks';

export const LOCAL_RESIZE_PROPERTY = '--local-resizing-width';

export class ResizingMarkView implements NodeView {
	dom: HTMLElement;
	contentDOM: HTMLElement;
	view: EditorView;
	mark: Mark;
	destroyFn: ((isChangeToViewMode?: boolean) => void) | undefined;
	intl: IntlShape;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	unsubscribeToViewModeChange: (() => void) | undefined;
	isResizingInitialised: boolean = false;

	/**
	 * Wrap node view in a resizing mark view
	 * @param {Mark} mark - The breakout mark to resize
	 * @param {EditorView} view - The editor view
	 * @param {ExtractInjectionAPI<BreakoutPlugin> | undefined} api - The pluginInjectionAPI
	 * @param {Function} getIntl - () => IntlShape
	 * @param {PortalProviderAPI} - The nodeViewPortalProviderAPI
	 * @example
	 * ```ts
	 * ```
	 */
	constructor(
		mark: Mark,
		view: EditorView,
		api: ExtractInjectionAPI<BreakoutPlugin> | undefined,
		getIntl: () => IntlShape,
		nodeViewPortalProviderAPI: PortalProviderAPI,
	) {
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
		contentDOM.style.zIndex = '1';

		if (fg('platform_editor_breakout_resizing_hello_release')) {
			if (mark.attrs.width) {
				contentDOM.style.width = `min(var(${LOCAL_RESIZE_PROPERTY}, ${mark.attrs.width}px), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding)))`;
			} else {
				if (mark.attrs.mode === 'wide') {
					contentDOM.style.width = `max(var(--ak-editor--line-length), min(var(${LOCAL_RESIZE_PROPERTY}, var(--ak-editor--breakout-wide-layout-width)), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
				}
				if (mark.attrs.mode === 'full-width') {
					contentDOM.style.width = `max(var(--ak-editor--line-length), min(var(${LOCAL_RESIZE_PROPERTY}, var(--ak-editor--full-width-layout-width)), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
				}
			}
		} else {
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
		}

		dom.appendChild(contentDOM);

		if (fg('platform_editor_breakout_resizing_hello_release')) {
			this.dom = dom;
			this.contentDOM = contentDOM;
			this.view = view;
			this.mark = mark;
			this.intl = getIntl();
			this.nodeViewPortalProviderAPI = nodeViewPortalProviderAPI;

			const isLiveViewMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'view';
			if (!isLiveViewMode) {
				this.setupResizerCallbacks(dom, contentDOM, view, mark, api);
			}
		} else {
			const callbacks = createResizerCallbacks({ dom, contentDOM, view, mark, api });
			this.intl = getIntl();
			this.nodeViewPortalProviderAPI = nodeViewPortalProviderAPI;
			const { leftHandle, rightHandle, destroy } = createPragmaticResizer({
				target: contentDOM,
				...callbacks,
				intl: this.intl,
				nodeViewPortalProviderAPI: this.nodeViewPortalProviderAPI,
			});

			dom.prepend(leftHandle);
			dom.appendChild(rightHandle);

			this.dom = dom;
			this.contentDOM = contentDOM;
			this.view = view;
			this.mark = mark;
			this.destroyFn = destroy;
		}

		if (fg('platform_editor_breakout_resizing_hello_release')) {
			this.unsubscribeToViewModeChange = api?.editorViewMode?.sharedState.onChange(
				(sharedState) => {
					if (sharedState.nextSharedState?.mode !== sharedState.prevSharedState?.mode) {
						if (sharedState.nextSharedState?.mode === 'view' && this.isResizingInitialised) {
							this.destroyFn?.(true);
							this.isResizingInitialised = false;
						} else if (
							sharedState.nextSharedState?.mode === 'edit' &&
							!this.isResizingInitialised
						) {
							this.setupResizerCallbacks(dom, contentDOM, view, mark, api);
						}
					}
				},
			);
		}
	}

	setupResizerCallbacks(
		dom: HTMLElement,
		contentDOM: HTMLElement,
		view: EditorView,
		mark: Mark,
		api?: ExtractInjectionAPI<BreakoutPlugin>,
	) {
		const callbacks = createResizerCallbacks({ dom, contentDOM, view, mark, api });
		const { leftHandle, rightHandle, destroy } = createPragmaticResizer({
			target: contentDOM,
			...callbacks,
			intl: this.intl,
			nodeViewPortalProviderAPI: this.nodeViewPortalProviderAPI,
		});

		this.dom.prepend(leftHandle);
		this.dom.appendChild(rightHandle);
		this.destroyFn = destroy;
		this.isResizingInitialised = true;
	}

	ignoreMutation() {
		return true;
	}

	destroy() {
		this.destroyFn?.();
		if (fg('platform_editor_breakout_resizing_hello_release')) {
			this.unsubscribeToViewModeChange?.();
		}
	}
}
