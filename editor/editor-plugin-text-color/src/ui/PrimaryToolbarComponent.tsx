import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
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

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<TextColorPlugin> | undefined) => {
		const color = useSharedPluginStateSelector(api, 'textColor.color');
		const defaultColor = useSharedPluginStateSelector(api, 'textColor.defaultColor');
		const palette = useSharedPluginStateSelector(api, 'textColor.palette');
		const textColorDisabled = useSharedPluginStateSelector(api, 'textColor.disabled');
		return {
			color,
			defaultColor,
			palette,
			textColorDisabled,
		};
	},
	(api: ExtractInjectionAPI<TextColorPlugin> | undefined) => {
		const { textColorState } = useSharedPluginState(api, ['textColor']);
		return {
			color: textColorState?.color,
			defaultColor: textColorState?.defaultColor,
			palette: textColorState?.palette,
			textColorDisabled: textColorState?.disabled,
		};
	},
);

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
	const { color, defaultColor, palette, textColorDisabled } = useSharedState(api);

	if (color === undefined || defaultColor === undefined || palette === undefined) {
		return null;
	}
	return (
		<ToolbarTextColor
			pluginState={{ color, defaultColor, palette, disabled: textColorDisabled }}
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
