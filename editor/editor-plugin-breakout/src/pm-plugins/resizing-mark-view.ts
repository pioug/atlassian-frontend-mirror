import type { IntlShape } from 'react-intl';

import type { PortalProviderAPI } from '@atlaskit/editor-common/common';
import { BreakoutCssClassName } from '@atlaskit/editor-common/styles/breakout';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { BreakoutPlugin } from '../breakoutPluginType';
import { createPragmaticResizer } from './pragmatic-resizer';
import { createResizerCallbacks } from './resizer-callbacks';

export const LOCAL_RESIZE_PROPERTY = '--local-resizing-width';

const RESIZE_HANDLE_TRACK_WIDTH = '7px';

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

		const isRemoveLeftResizeHandleEnabled = isExperimentEnabled(
			'platform_editor_remove_left_resize_handle',
		);

		const isResizingDividersPanelsEnabled = expValEquals(
			'platform_editor_lovability_resize_dividers_panels',
			'isEnabled',
			true,
		);

		const isResizingExtensionsEnabled = isExperimentEnabled(
			'platform_editor_lovability_resize_extensions',
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
			dom.style.gridTemplateColumns =
				isResizingDividersPanelsEnabled ||
				isResizingExtensionsEnabled ||
				isRemoveLeftResizeHandleEnabled
					? // new code - phantom left track + content + right handle
						`${RESIZE_HANDLE_TRACK_WIDTH} max(var(--ak-editor--breakout-min-width), min(var(${LOCAL_RESIZE_PROPERTY}, ${mark.attrs.width}px), var(--ak-editor--breakout-fallback-width))) ${RESIZE_HANDLE_TRACK_WIDTH}`
					: // old code - left handle + content + right handle
						`auto max(var(--ak-editor--breakout-min-width), min(var(${LOCAL_RESIZE_PROPERTY}, ${mark.attrs.width}px), var(--ak-editor--breakout-fallback-width))) auto`;
		} else {
			if (
				isResizingDividersPanelsEnabled ||
				isResizingExtensionsEnabled ||
				isRemoveLeftResizeHandleEnabled
			) {
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
			this.setupResizerCallbacks(dom, contentDOM, view, mark, api);
		}

		this.unsubscribeToViewModeChange = api?.editorViewMode?.sharedState.onChange((sharedState) => {
			if (sharedState.nextSharedState?.mode !== sharedState.prevSharedState?.mode) {
				if (sharedState.nextSharedState?.mode === 'view' && this.isResizingInitialised) {
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
		});

		if (leftHandle) {
			this.dom.prepend(leftHandle);
		}
		this.dom.appendChild(rightHandle);
		this.destroyFn = destroy;
		this.isResizingInitialised = true;
	}

	ignoreMutation() {
		return true;
	}

	destroy(): void {
		this.destroyFn?.();
		this.unsubscribeToViewModeChange?.();
	}
}
