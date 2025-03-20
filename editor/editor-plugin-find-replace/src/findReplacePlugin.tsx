import React from 'react';

import { ToolbarSize, type ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { FindReplacePlugin } from './findReplacePluginType';
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/main';
import { findReplacePluginKey } from './pm-plugins/plugin-key';
import type { FindReplaceToolbarButtonActionProps } from './types';
import FindReplaceDropDownOrToolbarButtonWithState from './ui/FindReplaceDropDownOrToolbarButtonWithState';

export const findReplacePlugin: FindReplacePlugin = ({ config: props, api }) => {
	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		popupsBoundariesElement,
		popupsMountPoint,
		popupsScrollableElement,
		isToolbarReducedSpacing,
		toolbarSize,
		editorView,
		containerElement,
		dispatchAnalyticsEvent,
	}) => {
		const isButtonHidden = fg('platform_editor_toolbar_responsive_fixes')
			? toolbarSize < ToolbarSize.XL
			: false;
		if (props?.twoLineEditorToolbar) {
			return null;
		} else {
			return (
				<FindReplaceDropDownOrToolbarButtonWithState
					popupsBoundariesElement={popupsBoundariesElement}
					popupsMountPoint={popupsMountPoint}
					popupsScrollableElement={popupsScrollableElement}
					isToolbarReducedSpacing={isToolbarReducedSpacing}
					editorView={editorView}
					containerElement={containerElement}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					takeFullWidth={props?.takeFullWidth}
					api={api}
					isButtonHidden={isButtonHidden}
				/>
			);
		}
	};
	api?.primaryToolbar?.actions.registerComponent({
		name: 'findReplace',
		component: primaryToolbarComponent,
	});

	return {
		name: 'findReplace',

		pmPlugins() {
			return [
				{
					name: 'findReplace',
					plugin: ({ dispatch }) => createPlugin(dispatch),
				},
				{
					name: 'findReplaceKeymap',
					plugin: () => keymapPlugin(api?.analytics?.actions),
				},
			];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			return findReplacePluginKey.getState(editorState) || undefined;
		},

		actions: {
			getToolbarButton: ({
				popupsBoundariesElement,
				popupsMountPoint,
				popupsScrollableElement,
				editorView,
				containerElement,
				dispatchAnalyticsEvent,
				isToolbarReducedSpacing,
			}: FindReplaceToolbarButtonActionProps) => {
				return (
					<FindReplaceDropDownOrToolbarButtonWithState
						popupsBoundariesElement={popupsBoundariesElement}
						popupsMountPoint={popupsMountPoint}
						popupsScrollableElement={popupsScrollableElement}
						editorView={editorView}
						containerElement={containerElement}
						dispatchAnalyticsEvent={dispatchAnalyticsEvent}
						isToolbarReducedSpacing={isToolbarReducedSpacing}
						api={api}
					/>
				);
			},
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,

		contentComponent: editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
			? ({
					editorView,
					containerElement,
					popupsMountPoint,
					popupsBoundariesElement,
					popupsScrollableElement,
					wrapperElement,
					dispatchAnalyticsEvent,
				}) => {
					return (
						<FindReplaceDropDownOrToolbarButtonWithState
							popupsBoundariesElement={popupsBoundariesElement}
							popupsMountPoint={popupsMountPoint || wrapperElement || undefined}
							popupsScrollableElement={popupsScrollableElement || containerElement || undefined}
							isToolbarReducedSpacing={false}
							editorView={editorView}
							containerElement={containerElement}
							dispatchAnalyticsEvent={dispatchAnalyticsEvent}
							takeFullWidth={props?.takeFullWidth}
							api={api}
							doesNotHaveButton={true}
						/>
					);
				}
			: undefined,
	};
};
