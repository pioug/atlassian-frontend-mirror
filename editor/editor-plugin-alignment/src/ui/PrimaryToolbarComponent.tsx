import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { AlignmentPlugin } from '../alignmentPluginType';
import { changeAlignment } from '../editor-commands';
import { ToolbarType, type AlignmentState } from '../pm-plugins/types';

import ToolbarAlignment from './ToolbarAlignment';

interface PrimaryToolbarComponentProps {
	api: ExtractInjectionAPI<AlignmentPlugin> | undefined;
	disabled: boolean;
	editorView: EditorView;
	isToolbarReducedSpacing: boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
}

export function PrimaryToolbarComponent({
	api,
	editorView,
	disabled,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	isToolbarReducedSpacing,
}: PrimaryToolbarComponentProps) {
	const { align, isEnabled } = useSharedPluginStateWithSelector(api, ['alignment'], (states) => {
		return {
			align: states.alignmentState?.align,
			isEnabled: states.alignmentState?.isEnabled,
		};
	});

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
		/>
	);
}
