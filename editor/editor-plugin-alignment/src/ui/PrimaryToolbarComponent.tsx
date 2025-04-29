import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { ToolbarSize, type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { AlignmentPlugin } from '../alignmentPluginType';
import { changeAlignment } from '../editor-commands';
import { ToolbarType, type AlignmentState } from '../pm-plugins/types';

import ToolbarAlignment from './ToolbarAlignment';

interface PrimaryToolbarComponentProps {
	api: ExtractInjectionAPI<AlignmentPlugin> | undefined;
	editorView: EditorView;
	disabled: boolean;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	isToolbarReducedSpacing: boolean;
	toolbarSize?: ToolbarSize;
}

export function PrimaryToolbarComponent({
	api,
	editorView,
	disabled,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	isToolbarReducedSpacing,
	toolbarSize = ToolbarSize.XXL,
}: PrimaryToolbarComponentProps) {
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
		(align: AlignmentState) =>
			changeAlignment(align, api, INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch),
		[editorView, api],
	);

	return (
		<ToolbarAlignment
			align={align}
			isReducedSpacing={isToolbarReducedSpacing}
			changeAlignment={changeAlignmentCallback}
			disabled={disabled || !isEnabled}
			popupsMountPoint={popupsMountPoint}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsScrollableElement={popupsScrollableElement}
			api={api}
			toolbarType={ToolbarType.PRIMARY}
			toolbarSize={toolbarSize}
		/>
	);
}
