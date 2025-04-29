import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
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

export function FloatingToolbarComponent({ api, editorView }: FloatingToolbarComponentProps) {
	const { alignmentState } = useSharedPluginState(api, ['alignment'], {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
	});

	const alignSelector = useSharedPluginStateSelector(api, 'alignment.align', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const align = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? alignSelector
		: alignmentState?.align;

	const isEnabledSelector = useSharedPluginStateSelector(api, 'alignment.isEnabled', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isEnabled = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? isEnabledSelector
		: alignmentState?.isEnabled;

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
