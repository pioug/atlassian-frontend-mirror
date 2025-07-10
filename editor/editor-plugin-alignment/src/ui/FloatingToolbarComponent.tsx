import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { AlignmentPlugin } from '../alignmentPluginType';
import { changeAlignment } from '../editor-commands';
import type { AlignmentState } from '../pm-plugins/types';
import { ToolbarType } from '../pm-plugins/types';

import ToolbarAlignment from './ToolbarAlignment';

interface FloatingToolbarComponentProps {
	api: ExtractInjectionAPI<AlignmentPlugin> | undefined;
	editorView: EditorView;
}

const FloatingToolbarSettings = {
	disabled: false,
	isToolbarReducedSpacing: true,
};

const useFloatingToolbarComponentPluginState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<AlignmentPlugin> | undefined) => {
		const { align, isEnabled } = useSharedPluginStateWithSelector(api, ['alignment'], (states) => {
			return {
				align: states.alignmentState?.align,
				isEnabled: states.alignmentState?.isEnabled,
			};
		});
		return {
			align,
			isEnabled,
		};
	},
	(api: ExtractInjectionAPI<AlignmentPlugin> | undefined) => {
		const { alignmentState } = useSharedPluginState(api, ['alignment']);
		return {
			align: alignmentState?.align,
			isEnabled: alignmentState?.isEnabled,
		};
	},
);

export function FloatingToolbarComponent({ api, editorView }: FloatingToolbarComponentProps) {
	const { align, isEnabled } = useFloatingToolbarComponentPluginState(api);
	const changeAlignmentCallback = useCallback(
		(align: AlignmentState) => {
			return changeAlignment(
				align,
				api,
				INPUT_METHOD.FLOATING_TB,
			)(editorView.state, editorView.dispatch);
		},
		[editorView, api],
	);

	return (
		<ToolbarAlignment
			align={align}
			isReducedSpacing={
				editorExperiment('platform_editor_controls', 'variant1')
					? false
					: FloatingToolbarSettings.isToolbarReducedSpacing
			}
			changeAlignment={changeAlignmentCallback}
			disabled={FloatingToolbarSettings.disabled || !isEnabled}
			toolbarType={ToolbarType.FLOATING}
			api={api}
		/>
	);
}
