import React, { useCallback } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

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
	const { alignmentState } = useSharedPluginState(api, ['alignment']);

	const changeAlignmentCallback = useCallback(
		(align: AlignmentState) => {
			return changeAlignment(align)(editorView.state, editorView.dispatch);
		},
		[editorView],
	);

	return (
		<ToolbarAlignment
			pluginState={alignmentState}
			isReducedSpacing={FloatingToolbarSettings.isToolbarReducedSpacing}
			changeAlignment={changeAlignmentCallback}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			disabled={FloatingToolbarSettings.disabled || !alignmentState!.isEnabled}
			toolbarType={ToolbarType.FLOATING}
			api={api}
		/>
	);
}
