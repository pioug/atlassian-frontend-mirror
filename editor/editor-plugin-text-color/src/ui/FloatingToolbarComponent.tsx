import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TextColorPlugin } from '../textColorPluginType';
import { ToolbarType } from '../types';

import ToolbarTextColor from './ToolbarTextColor';

interface FloatingToolbarComponentProps {
	editorView: EditorView;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	api: ExtractInjectionAPI<TextColorPlugin> | undefined;
}

const FloatingToolbarSettings = {
	disabled: false,
	isReducedSpacing: true,
};

export function FloatingToolbarComponent({
	api,
	editorView,
	dispatchAnalyticsEvent,
}: FloatingToolbarComponentProps) {
	const { textColorState } = useSharedPluginState(api, ['textColor']);

	return (
		<ToolbarTextColor
			pluginState={textColorState!}
			isReducedSpacing={FloatingToolbarSettings.isReducedSpacing}
			editorView={editorView}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			disabled={FloatingToolbarSettings.disabled}
			pluginInjectionApi={api}
			toolbarType={ToolbarType.FLOATING}
		/>
	);
}
