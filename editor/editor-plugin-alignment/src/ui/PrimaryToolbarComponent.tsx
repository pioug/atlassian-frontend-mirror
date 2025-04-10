import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { ToolbarSize, type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

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
	const { alignmentState } = useSharedPluginState(api, ['alignment']);
	const changeAlignmentCallback = useCallback(
		(align: AlignmentState) =>
			changeAlignment(align, api, INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch),
		[editorView, api],
	);

	return (
		<ToolbarAlignment
			pluginState={alignmentState}
			isReducedSpacing={isToolbarReducedSpacing}
			changeAlignment={changeAlignmentCallback}
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			disabled={disabled || !alignmentState!.isEnabled}
			popupsMountPoint={popupsMountPoint}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsScrollableElement={popupsScrollableElement}
			api={api}
			toolbarType={ToolbarType.PRIMARY}
			toolbarSize={toolbarSize}
		/>
	);
}
