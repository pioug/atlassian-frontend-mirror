import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TextColorPlugin } from '../types';
import { ToolbarType } from '../types';

import ToolbarTextColor from './ToolbarTextColor';

interface PrimaryToolbarComponentProps {
	isReducedSpacing: boolean;
	editorView: EditorView;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	disabled: boolean;
	api: ExtractInjectionAPI<TextColorPlugin> | undefined;
}

export function PrimaryToolbarComponent({
	api,
	isReducedSpacing,
	editorView,
	popupsMountPoint,
	popupsScrollableElement,
	popupsBoundariesElement,
	dispatchAnalyticsEvent,
	disabled,
}: PrimaryToolbarComponentProps) {
	const { textColorState } = useSharedPluginState(api, ['textColor']);
	return (
		<ToolbarTextColor
			pluginState={textColorState!}
			isReducedSpacing={isReducedSpacing}
			editorView={editorView}
			popupsMountPoint={popupsMountPoint}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsScrollableElement={popupsScrollableElement}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			disabled={disabled}
			pluginInjectionApi={api}
			toolbarType={ToolbarType.PRIMARY}
		/>
	);
}
