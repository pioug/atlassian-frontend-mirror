import type { IntlShape } from 'react-intl';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { BreakoutCssClassName } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { BreakoutPlugin } from '../breakoutPluginType';

import { createPragmaticResizer } from './pragmatic-resizer';
import { createResizerCallbacks } from './resizer-callbacks';

export const LOCAL_RESIZE_PROPERTY = '--local-resizing-width';

const RESIZE_HANDLE_TRACK_WIDTH = '7px';

// this function delays the resizer callbacks until the mark view DOM is attached to the DOM
const scheduleResizeHandleSetup = (callback: () => void): (() => void) => {
	if (typeof window === 'undefined') {
		return () => {};
	}

	if (typeof window.requestAnimationFrame === 'function') {
		const frame = window.requestAnimationFrame(callback);
		return () => window.cancelAnimationFrame(frame);
	}

	const timeout = window.setTimeout(callback, 0);
	return () => window.clearTimeout(timeout);
};

export class ResizingMarkView implements NodeView {
	dom: HTMLElement;
	contentDOM: HTMLElement;
	view: EditorView;
	mark: Mark;
	destroyFn: ((isChangeToViewMode?: boolean) => void) | undefined;
	cancelScheduledResizeHandleSetup: (() => void) | undefined;
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

		const isResizingExperimentEnabled = expValEquals(
			'platform_editor_lovability_resize_dividers_panels',
			'isEnabled',
			true,
		);

		// DOM styles
		// Keep a three-column grid even when the left resize handle is disabled. The empty
		// left track preserves the original content alignment without translating `contentDOM`,
		// so floating UI anchored to the node (for example block drag handles) keeps its position.
		dom.style.transform = 'none';
		dom.style.display = 'grid';
		dom.style.justifyContent = 'center';

		// contentDOM styles
		contentDOM.style.gridColumn = '2';
		contentDOM.style.zIndex = '1';

		if (mark.attrs.width) {
			dom.style.gridTemplateColumns = isResizingExperimentEnabled
				? // new code - phantom left track + content + right handle
					`${RESIZE_HANDLE_TRACK_WIDTH} max(var(--ak-editor--breakout-min-width), min(var(${LOCAL_RESIZE_PROPERTY}, ${mark.attrs.width}px), var(--ak-editor--breakout-fallback-width))) ${RESIZE_HANDLE_TRACK_WIDTH}`
				: // old code - left handle + content + right handle
					`auto max(var(--ak-editor--breakout-min-width), min(var(${LOCAL_RESIZE_PROPERTY}, ${mark.attrs.width}px), var(--ak-editor--breakout-fallback-width))) auto`;
		} else {
			if (isResizingExperimentEnabled) {
				dom.style.gridTemplateColumns = `${RESIZE_HANDLE_TRACK_WIDTH} auto ${RESIZE_HANDLE_TRACK_WIDTH}`;
			}
			if (mark.attrs.mode === 'wide') {
				contentDOM.style.width = `max(var(--ak-editor--line-length), min(var(${LOCAL_RESIZE_PROPERTY}, var(--ak-editor--breakout-wide-layout-width)), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
			}
			if (mark.attrs.mode === 'full-width') {
				contentDOM.style.width = `max(var(--ak-editor--line-length), min(var(${LOCAL_RESIZE_PROPERTY}, var(--ak-editor--full-width-layout-width)), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
			}
		}

		dom.appendChild(contentDOM);

		this.dom = dom;
		this.contentDOM = contentDOM;
		this.view = view;
		this.mark = mark;
		this.intl = getIntl();
		this.nodeViewPortalProviderAPI = nodeViewPortalProviderAPI;

		const isLiveViewMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'view';
		if (!isLiveViewMode) {
			fg('platform_editor_lovability_resize_gracefully')
				? this.setupResizerCallbacksIfSupported(
						dom,
						contentDOM,
						view,
						mark,
						isResizingExperimentEnabled,
						api,
					)
				: this.setupResizerCallbacks(dom, contentDOM, view, mark, api);
		}

		this.unsubscribeToViewModeChange = api?.editorViewMode?.sharedState.onChange((sharedState) => {
			if (sharedState.nextSharedState?.mode !== sharedState.prevSharedState?.mode) {
				if (fg('platform_editor_lovability_resize_gracefully')) {
					if (sharedState.nextSharedState?.mode === 'view') {
						this.cancelScheduledResizeHandleSetup?.();
						this.cancelScheduledResizeHandleSetup = undefined;
						if (this.isResizingInitialised) {
							this.destroyFn?.(true);
							this.isResizingInitialised = false;
						}
					} else if (sharedState.nextSharedState?.mode === 'edit' && !this.isResizingInitialised) {
						this.setupResizerCallbacksIfSupported(
							dom,
							contentDOM,
							view,
							mark,
							isResizingExperimentEnabled,
							api,
						);
					}
				} else if (sharedState.nextSharedState?.mode === 'view' && this.isResizingInitialised) {
					this.destroyFn?.(true);
					this.isResizingInitialised = false;
				} else if (sharedState.nextSharedState?.mode === 'edit' && !this.isResizingInitialised) {
					this.setupResizerCallbacks(dom, contentDOM, view, mark, api);
				}
			}
		});
	}

	setupResizerCallbacks(
		dom: HTMLElement,
		contentDOM: HTMLElement,
		view: EditorView,
		mark: Mark,
		api?: ExtractInjectionAPI<BreakoutPlugin>,
	): void {
		const callbacks = createResizerCallbacks({ dom, view, mark, api });
		const { leftHandle, rightHandle, destroy } = createPragmaticResizer({
			target: contentDOM,
			...callbacks,
			intl: this.intl,
			nodeViewPortalProviderAPI: this.nodeViewPortalProviderAPI,
		});

		if (leftHandle) {
			this.dom.prepend(leftHandle);
		}
		this.dom.appendChild(rightHandle);
		this.destroyFn = destroy;
		this.isResizingInitialised = true;
	}

	setupResizerCallbacksIfSupported(
		dom: HTMLElement,
		contentDOM: HTMLElement,
		view: EditorView,
		mark: Mark,
		isResizingExperimentEnabled: boolean,
		api?: ExtractInjectionAPI<BreakoutPlugin>,
	): void {
		// cancel any pending setup before scheduling a new one
		this.cancelScheduledResizeHandleSetup?.();
		this.cancelScheduledResizeHandleSetup = undefined;

		// if panels and rules support breakout resizing,
		// set up the resizer callbacks
		if (isResizingExperimentEnabled) {
			this.setupResizerCallbacks(dom, contentDOM, view, mark, api);
			return;
		}

		// else if panels and rules don't support breakout resizing,
		// do NOT set up the resizer callbacks (yet)
		// wait for the mark view DOM to be attached to the DOM first
		this.cancelScheduledResizeHandleSetup = scheduleResizeHandleSetup(() => {
			this.cancelScheduledResizeHandleSetup = undefined;

			if (view.isDestroyed || !dom.isConnected) {
				return;
			}

			const pos = view.posAtDOM(dom, 0);
			const nodeName = view.state.doc.nodeAt(pos)?.type.name;

			// if the node is a panel or a rule, do NOT set up the resizer callbacks
			if ((nodeName && ['panel', 'rule'].includes(nodeName)) || this.isResizingInitialised) {
				return;
			}

			// else, continue to set up the resizer callbacks
			this.setupResizerCallbacks(dom, contentDOM, view, mark, api);
		});
	}

	ignoreMutation() {
		return true;
	}

	destroy(): void {
		this.destroyFn?.();
		this.unsubscribeToViewModeChange?.();
		this.cancelScheduledResizeHandleSetup?.();
	}
}
