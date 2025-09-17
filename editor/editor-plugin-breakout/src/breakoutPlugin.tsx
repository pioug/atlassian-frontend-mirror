import React, { useState } from 'react';

import type { BreakoutMarkAttrs } from '@atlaskit/adf-schema';
import { breakout } from '@atlaskit/adf-schema';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { BreakoutCssClassName } from '@atlaskit/editor-common/styles';
import type {
	BreakoutMode,
	EditorAppearance,
	ExtractInjectionAPI,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import { usePluginStateEffect } from '@atlaskit/editor-common/use-plugin-state-effect';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { Mark as PMMark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { type EditorView, type NodeView } from '@atlaskit/editor-prosemirror/view';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BreakoutPlugin, BreakoutPluginState } from './breakoutPluginType';
import { pluginKey } from './pm-plugins/plugin-key';
import { createResizingPlugin, resizingPluginKey } from './pm-plugins/resizing-plugin';
import { findSupportedNodeForBreakout } from './pm-plugins/utils/find-breakout-node';
import { getBreakoutMode } from './pm-plugins/utils/get-breakout-mode';
import { GuidelineLabel } from './ui/GuidelineLabel';
import type { Props as LayoutButtonProps } from './ui/LayoutButton';
import LayoutButton from './ui/LayoutButton';

type BreakoutPMMark = Omit<PMMark, 'attrs'> & { attrs: BreakoutMarkAttrs };

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
		appearance: EditorAppearance | undefined,
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
					if (
						appearance &&
						appearance === 'full-width' &&
						editorExperiment('single_column_layouts', true) &&
						fg('platform_editor_layout_guideline_full_width_fix')
					) {
						contentDOM.style.minWidth = `min(var(--ak-editor--breakout-wide-layout-width), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding)))`;
					} else {
						contentDOM.style.minWidth = `max(var(--ak-editor--line-length), min(var(--ak-editor--breakout-wide-layout-width), calc(100cqw - var(--ak-editor--breakout-full-page-guttering-padding))))`;
					}
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
	api: ExtractInjectionAPI<BreakoutPlugin> | undefined,
	{ dispatch }: PMPluginFactoryParams,
	appearance: EditorAppearance | undefined,
) {
	return new SafePlugin({
		state: {
			init() {
				return {
					breakoutNode: undefined,
					activeGuidelineKey: undefined,
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
					return new BreakoutView(mark, view, appearance);
				},
			},
		},
	});
}

interface LayoutButtonWrapperProps
	extends Omit<LayoutButtonProps, 'node' | 'breakoutMode' | 'isBreakoutNodePresent'> {
	api: ExtractInjectionAPI<typeof breakoutPlugin> | undefined;
}

const LayoutButtonWrapper = ({
	api,
	editorView,
	boundariesElement,
	scrollableElement,
	mountPoint,
}: LayoutButtonWrapperProps) => {
	const { editorDisabled, isDragging, isPMDragging, mode } = useSharedPluginStateWithSelector(
		api,
		['editorViewMode', 'editorDisabled', 'blockControls'],
		(states) => ({
			isDragging: states.blockControlsState?.isDragging,
			isPMDragging: states.blockControlsState?.isPMDragging,
			mode: states.editorViewModeState?.mode,
			editorDisabled: states.editorDisabledState?.editorDisabled,
		}),
	);
	const [breakoutNodePresent, setBreakoutNodePresent] = useState(false);
	const [breakoutMode, setBreakoutMode] = useState<BreakoutMode | undefined>(
		expValEquals('platform_editor_hydratable_ui', 'isEnabled', true) && !editorView
			? undefined
			: // Remove ! during platform_editor_hydratable_ui cleanup
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				getBreakoutMode(editorView!.state),
	);

	usePluginStateEffect(api, ['breakout'], ({ breakoutState }) => {
		if (expValEquals('platform_editor_hydratable_ui', 'isEnabled', true) && !editorView) {
			return;
		}
		if (breakoutState?.breakoutNode && !breakoutNodePresent) {
			setBreakoutNodePresent(true);
		}
		if (!breakoutState?.breakoutNode && breakoutNodePresent) {
			setBreakoutNodePresent(false);
		}
		// Remove ! during platform_editor_hydratable_ui cleanup
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const nextBreakoutMode = getBreakoutMode(editorView!.state);
		if (nextBreakoutMode !== breakoutMode) {
			setBreakoutMode(nextBreakoutMode);
		}
	});

	const interactionState = useSharedPluginStateSelector(api, 'interaction.interactionState');

	if (interactionState === 'hasNotHadInteraction') {
		return null;
	}

	if (isDragging || isPMDragging) {
		if (editorExperiment('advanced_layouts', true)) {
			return null;
		}
	}

	const isViewMode = mode === 'view';
	const isEditMode = mode === 'edit';
	return !isViewMode && editorDisabled === false ? (
		<LayoutButton
			editorView={editorView}
			mountPoint={mountPoint}
			boundariesElement={boundariesElement}
			scrollableElement={scrollableElement}
			isLivePage={isEditMode}
			isBreakoutNodePresent={breakoutNodePresent}
			breakoutMode={breakoutMode}
			api={api}
		/>
	) : null;
};

export const breakoutPlugin: BreakoutPlugin = ({ config: options, api }) => ({
	name: 'breakout',

	pmPlugins() {
		if (expValEquals('platform_editor_breakout_resizing', 'isEnabled', true)) {
			return [
				{
					name: 'breakout-resizing',
					plugin: ({ getIntl, nodeViewPortalProviderAPI }) =>
						createResizingPlugin(api, getIntl, nodeViewPortalProviderAPI, options),
				},
			];
		}

		return [
			{
				name: 'breakout',
				plugin: (props) => createPlugin(api, props, options?.appearance),
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

		if (
			expValEquals('platform_editor_breakout_resizing', 'isEnabled', true) &&
			fg('platform_editor_breakout_resizing_hello_release')
		) {
			const resizingPluginState = resizingPluginKey.getState(editorState);

			if (!resizingPluginState) {
				return {
					breakoutNode: undefined,
					activeGuidelineKey: undefined,
				};
			}

			return resizingPluginState;
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
		if (!editorView) {
			return null;
		}

		if (
			expValEquals('platform_editor_breakout_resizing', 'isEnabled', true) &&
			fg('platform_editor_breakout_resizing_hello_release')
		) {
			return (
				<GuidelineLabel
					api={api}
					editorView={editorView}
					mountPoint={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					scrollableElement={popupsScrollableElement}
				/>
			);
		}

		// This is a bit crappy, but should be resolved once we move to a static schema.
		if (options && !options.allowBreakoutButton) {
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
