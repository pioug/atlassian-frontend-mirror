import React from 'react';

import type { BreakoutMarkAttrs } from '@atlaskit/adf-schema';
import { breakout } from '@atlaskit/adf-schema';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { BreakoutCssClassName } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { Mark as PMMark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { type EditorView, type NodeView } from '@atlaskit/editor-prosemirror/view';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BreakoutPlugin, BreakoutPluginState } from './breakoutPluginType';
import { pluginKey } from './pm-plugins/plugin-key';
import { findSupportedNodeForBreakout } from './pm-plugins/utils/find-breakout-node';
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
					return new BreakoutView(mark, view);
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
	// Re-render with `width` (but don't use state) due to https://bitbucket.org/atlassian/%7Bc8e2f021-38d2-46d0-9b7a-b3f7b428f724%7D/pull-requests/24272
	const { breakoutState, editorViewModeState, editorDisabledState, blockControlsState } =
		useSharedPluginState(
			api,
			['width', 'breakout', 'editorViewMode', 'editorDisabled', 'blockControls'],
			{
				disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
			},
		);

	// breakoutNode
	const breakoutNodeSelector = useSharedPluginStateSelector(api, 'breakout.breakoutNode', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const breakoutNode = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? breakoutNodeSelector
		: breakoutState?.breakoutNode;

	// isDragging
	const isDraggingSelector = useSharedPluginStateSelector(api, 'blockControls.isDragging', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isDragging = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? isDraggingSelector
		: blockControlsState?.isDragging;

	// isPMDragging
	const isPMDraggingSelector = useSharedPluginStateSelector(api, 'blockControls.isPMDragging', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isPMDragging = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? isPMDraggingSelector
		: blockControlsState?.isPMDragging;

	// mode
	const modeSelector = useSharedPluginStateSelector(api, 'editorViewMode.mode', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const mode = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? modeSelector
		: editorViewModeState?.mode;

	// editorDisabled
	const editorDisabledSelector = useSharedPluginStateSelector(
		api,
		'editorDisabled.editorDisabled',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const editorDisabled = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? editorDisabledSelector
		: editorDisabledState?.editorDisabled;

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
			node={breakoutNode?.node ?? null}
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
