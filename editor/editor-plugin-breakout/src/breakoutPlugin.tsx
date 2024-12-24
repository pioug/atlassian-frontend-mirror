import React from 'react';

import type { BreakoutMarkAttrs } from '@atlaskit/adf-schema';
import { breakout } from '@atlaskit/adf-schema';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { BreakoutCssClassName } from '@atlaskit/editor-common/styles';
import type {
	ExtractInjectionAPI,
	PMPluginFactoryParams,
	EditorContainerWidth as WidthPluginState,
} from '@atlaskit/editor-common/types';
import { calcBreakoutWidthPx } from '@atlaskit/editor-common/utils';
import type { Mark as PMMark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { type EditorView, type NodeView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorGutterPaddingDynamic,
	akEditorSwoopCubicBezier,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BreakoutPlugin, BreakoutPluginState } from './breakoutPluginType';
import { pluginKey } from './pm-plugins/plugin-key';
import { findSupportedNodeForBreakout } from './pm-plugins/utils/find-breakout-node';
import type { Props as LayoutButtonProps } from './ui/LayoutButton';
import LayoutButton from './ui/LayoutButton';

type BreakoutPMMark = Omit<PMMark, 'attrs'> & { attrs: BreakoutMarkAttrs };

class BreakoutViewOld {
	dom: HTMLElement;
	contentDOM: HTMLElement;
	view: EditorView;
	mark: BreakoutPMMark;
	unsubscribe: (() => void) | undefined;

	constructor(
		/**
		 * Note: this is actually a PMMark -- however our version
		 * of the prosemirror and prosemirror types mean using PMNode
		 * is not problematic.
		 */
		mark: PMNode,
		view: EditorView,
		pluginInjectionApi: ExtractInjectionAPI<typeof breakoutPlugin> | undefined,
	) {
		const contentDOM = document.createElement('div');
		contentDOM.className = BreakoutCssClassName.BREAKOUT_MARK_DOM;
		contentDOM.setAttribute('data-testid', 'ak-editor-breakout-mark-dom');

		const dom = document.createElement('div');
		dom.className = BreakoutCssClassName.BREAKOUT_MARK;
		dom.setAttribute('data-layout', mark.attrs.mode);
		dom.setAttribute('data-testid', 'ak-editor-breakout-mark');
		dom.appendChild(contentDOM);

		this.dom = dom;
		this.mark = mark as unknown as BreakoutPMMark;
		this.view = view;
		this.contentDOM = contentDOM;

		this.unsubscribe = pluginInjectionApi?.width?.sharedState.onChange(({ nextSharedState }) =>
			this.updateWidth(nextSharedState),
		);
		this.updateWidth(pluginInjectionApi?.width?.sharedState.currentState());
	}

	private updateWidth = (widthState: WidthPluginState | undefined) => {
		// we skip updating the width of breakout nodes if the editorView dom
		// element was hidden (to avoid breakout width and button thrashing
		// when an editor is hidden, re-rendered and unhidden).
		if (widthState === undefined || widthState.width === 0) {
			return;
		}

		let containerStyle = ``;
		let contentStyle = ``;

		// when editor padding = 32px the breakout padding is calculated as 96px (32 * 3)
		// the extra '32' ensures nodes with breakout applied default to line length its below default width
		const padding = fg('platform_editor_core_increase_full_page_guttering')
			? akEditorGutterPaddingDynamic() * 2 + 32
			: undefined;
		let breakoutWidthPx = calcBreakoutWidthPx(this.mark.attrs.mode, widthState.width, padding);
		if (widthState.lineLength) {
			if (breakoutWidthPx < widthState.lineLength) {
				breakoutWidthPx = widthState.lineLength;
			}
			containerStyle += `
        transform: none;
        display: flex;
        justify-content: center;
        `;

			// There is a delay in the animation because widthState is delayed.
			// When the editor goes full width the animation for the editor
			// begins and finishes before widthState can update the new dimensions.
			contentStyle += `
        min-width: ${breakoutWidthPx}px;
        transition: min-width 0.5s ${akEditorSwoopCubicBezier};
      `;
		} else {
			// fallback method
			// (lineLength is not normally undefined, but might be in e.g. SSR or initial render)
			//
			// this approach doesn't work well with position: fixed, so
			// it breaks things like sticky headers
			containerStyle += `width: ${breakoutWidthPx}px; transform: translateX(-50%); margin-left: 50%;`;
		}

		// NOTE: This is a hack to ignore mutation since mark NodeView doesn't support
		// `ignoreMutation` life-cycle event. @see ED-9947
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const viewDomObserver = (this.view as any).domObserver;
		if (viewDomObserver && this.view.dom) {
			viewDomObserver.stop();
			setTimeout(() => {
				viewDomObserver.start();
			}, 0);
		}

		if (typeof this.dom.style.cssText !== 'undefined') {
			this.dom.style.cssText = containerStyle;
			this.contentDOM.style.cssText = contentStyle;
		} else {
			this.dom.setAttribute('style', containerStyle);
			this.contentDOM.setAttribute('style', contentStyle);
		}
	};

	// NOTE: Lifecycle events doesn't work for mark NodeView. So currently this is a no-op.
	// @see https://github.com/ProseMirror/prosemirror/issues/1082
	destroy() {
		this.unsubscribe?.();
	}
}

class BreakoutView implements NodeView {
	dom: HTMLElement;
	contentDOM: HTMLElement;
	view: EditorView;
	mark: BreakoutPMMark;

	constructor(
		/**
		 * Note: this is actually a PMMark -- however our version
		 * of the prosemirror and prosemirror types mean using PMNode
		 * is not problematic.
		 */
		mark: PMNode,
		view: EditorView,
	) {
		const dom = document.createElement('div');
		const contentDOM = document.createElement('div');
		contentDOM.className = BreakoutCssClassName.BREAKOUT_MARK_DOM;
		contentDOM.setAttribute('data-testid', 'ak-editor-breakout-mark-dom');

		dom.className = BreakoutCssClassName.BREAKOUT_MARK;
		dom.setAttribute('data-layout', mark.attrs.mode);
		dom.setAttribute('data-testid', 'ak-editor-breakout-mark');
		dom.appendChild(contentDOM);

		dom.style.transform = 'none';
		dom.style.display = 'flex';
		dom.style.justifyContent = 'center';

		contentDOM.style.transition = `min-width 0.5s ${akEditorSwoopCubicBezier}`;

		if (editorExperiment('advanced_layouts', true)) {
			if (mark.attrs.width) {
				contentDOM.style.minWidth = `min(${mark.attrs.width}px, calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding)))`;
			} else {
				// original breakout algorithm is in calcBreakoutWidth from platform/packages/editor/editor-common/src/utils/breakout.ts
				if (mark.attrs.mode === 'full-width') {
					contentDOM.style.minWidth = `max(var(--ak-editor--line-length), min(var(--ak-editor--full-width-layout-width), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
				}
				if (mark.attrs.mode === 'wide') {
					contentDOM.style.minWidth = `max(var(--ak-editor--line-length), min(var(--ak-editor--breakout-wide-layout-width), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
				}
			}
		} else {
			// original breakout algorithm is in calcBreakoutWidth from platform/packages/editor/editor-common/src/utils/breakout.ts
			if (mark.attrs.mode === 'full-width') {
				contentDOM.style.minWidth = `max(var(--ak-editor--line-length), min(var(--ak-editor--full-width-layout-width), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
			}
			if (mark.attrs.mode === 'wide') {
				contentDOM.style.minWidth = `max(var(--ak-editor--line-length), min(var(--ak-editor--breakout-wide-layout-width), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
			}
		}

		this.dom = dom;
		this.mark = mark as unknown as BreakoutPMMark;
		this.view = view;
		this.contentDOM = contentDOM;
	}
}

function shouldPluginStateUpdate(
	newBreakoutNode?: ContentNodeWithPos,
	currentBreakoutNode?: ContentNodeWithPos,
): boolean {
	if (newBreakoutNode && currentBreakoutNode) {
		return newBreakoutNode !== currentBreakoutNode;
	}
	return newBreakoutNode || currentBreakoutNode ? true : false;
}

function createPlugin(
	pluginInjectionApi: ExtractInjectionAPI<typeof breakoutPlugin> | undefined,
	{ dispatch }: PMPluginFactoryParams,
) {
	return new SafePlugin({
		state: {
			init() {
				return {
					breakoutNode: undefined,
				};
			},
			apply(tr: ReadonlyTransaction, pluginState: BreakoutPluginState) {
				const breakoutNode = findSupportedNodeForBreakout(tr.selection);

				if (shouldPluginStateUpdate(breakoutNode, pluginState.breakoutNode)) {
					const nextPluginState = {
						...pluginState,
						breakoutNode,
					};
					dispatch(pluginKey, nextPluginState);
					return nextPluginState;
				}
				return pluginState;
			},
		},
		key: pluginKey,
		props: {
			nodeViews: {
				// Note: When we upgrade to prosemirror 1.27.2 -- we should
				// move this to markViews.
				// See the following link for more details:
				// https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews.
				breakout: (mark: PMNode, view: EditorView) => {
					if (fg('platform_editor_breakout_use_css')) {
						return new BreakoutView(mark, view);
					}
					return new BreakoutViewOld(mark, view, pluginInjectionApi);
				},
			},
		},
	});
}

interface LayoutButtonWrapperProps extends Omit<LayoutButtonProps, 'node'> {
	api: ExtractInjectionAPI<typeof breakoutPlugin> | undefined;
}

const LayoutButtonWrapper = ({
	api,
	editorView,
	boundariesElement,
	scrollableElement,
	mountPoint,
}: LayoutButtonWrapperProps) => {
	// Re-render with `width` (but don't use state) due to https://bitbucket.org/atlassian/%7Bc8e2f021-38d2-46d0-9b7a-b3f7b428f724%7D/pull-requests/24272
	const { breakoutState, editorViewModeState, editorDisabledState, blockControlsState } =
		useSharedPluginState(api, [
			'width',
			'breakout',
			'editorViewMode',
			'editorDisabled',
			'blockControls',
		]);

	if (blockControlsState?.isDragging || blockControlsState?.isPMDragging) {
		if (editorExperiment('advanced_layouts', true)) {
			return null;
		}
	}

	const isViewMode = editorViewModeState?.mode === 'view';
	const isEditMode = editorViewModeState?.mode === 'edit';
	if (fg('platform_editor_react_editor_view_react_18')) {
		return !isViewMode &&
			editorDisabledState !== undefined &&
			!editorDisabledState?.editorDisabled ? (
			<LayoutButton
				editorView={editorView}
				mountPoint={mountPoint}
				boundariesElement={boundariesElement}
				scrollableElement={scrollableElement}
				node={breakoutState?.breakoutNode?.node ?? null}
				isLivePage={isEditMode}
			/>
		) : null;
	}
	return !isViewMode ? (
		<LayoutButton
			editorView={editorView}
			mountPoint={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			node={breakoutState?.breakoutNode?.node ?? null}
			isLivePage={isEditMode}
		/>
	) : null;
};

export const breakoutPlugin: BreakoutPlugin = ({ config: options, api }) => ({
	name: 'breakout',

	pmPlugins() {
		return [
			{
				name: 'breakout',
				plugin: (props) => createPlugin(api, props),
			},
		];
	},
	marks() {
		return [{ name: 'breakout', mark: breakout }];
	},

	getSharedState(editorState) {
		if (!editorState) {
			return {
				breakoutNode: undefined,
			};
		}

		const pluginState = pluginKey.getState(editorState);

		if (!pluginState) {
			return {
				breakoutNode: undefined,
			};
		}

		return pluginState;
	},

	contentComponent({
		editorView,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
	}) {
		// This is a bit crappy, but should be resolved once we move to a static schema.
		if (
			(options && !options.allowBreakoutButton) ||
			(!editorView.editable && !fg('platform_editor_react_editor_view_react_18'))
		) {
			return null;
		}

		return (
			<LayoutButtonWrapper
				api={api}
				mountPoint={popupsMountPoint}
				editorView={editorView}
				boundariesElement={popupsBoundariesElement}
				scrollableElement={popupsScrollableElement}
			/>
		);
	},
});
