import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TextColorPlugin } from '../textColorPluginType';
import { ToolbarType } from '../types';

// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
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
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
