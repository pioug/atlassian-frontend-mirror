import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TextColorPlugin } from '../textColorPluginType';
import { ToolbarType } from '../types';

// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
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

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<TextColorPlugin> | undefined) => {
		const { color, defaultColor, palette, disabled } = useSharedPluginStateWithSelector(
			api,
			['textColor'],
			(states) => ({
				color: states.textColorState?.color,
				defaultColor: states.textColorState?.defaultColor,
				palette: states.textColorState?.palette,
				disabled: states.textColorState?.disabled,
			}),
		);
		return {
			color,
			defaultColor,
			palette,
			disabled,
		};
	},
	(api: ExtractInjectionAPI<TextColorPlugin> | undefined) => {
		const { textColorState } = useSharedPluginState(api, ['textColor']);
		return {
			color: textColorState?.color,
			defaultColor: textColorState?.defaultColor,
			palette: textColorState?.palette,
			disabled: textColorState?.disabled,
		};
	},
);

export function FloatingToolbarComponent({
	api,
	editorView,
	dispatchAnalyticsEvent,
}: FloatingToolbarComponentProps) {
	const { color, defaultColor, palette, disabled } = useSharedState(api);

	if (color === undefined || defaultColor === undefined || palette === undefined) {
		return null;
	}

	return (
		<ToolbarTextColor
			pluginState={{ color, defaultColor, palette, disabled }}
			isReducedSpacing={FloatingToolbarSettings.isReducedSpacing}
			editorView={editorView}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			disabled={FloatingToolbarSettings.disabled}
			pluginInjectionApi={api}
			toolbarType={ToolbarType.FLOATING}
		/>
	);
}
