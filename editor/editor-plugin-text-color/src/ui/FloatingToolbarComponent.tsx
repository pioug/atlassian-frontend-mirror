import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import {
	useSharedPluginStateWithSelector,
	type NamedPluginStatesFromInjectionAPI,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TextColorPlugin } from '../textColorPluginType';
import { ToolbarType } from '../types';

// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import ToolbarTextColor from './ToolbarTextColor';

interface FloatingToolbarComponentProps {
	api: ExtractInjectionAPI<TextColorPlugin> | undefined;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorView: EditorView;
}

const FloatingToolbarSettings = {
	disabled: false,
	isReducedSpacing: true,
};

const selector = (
	states: NamedPluginStatesFromInjectionAPI<ExtractInjectionAPI<TextColorPlugin>, 'textColor'>,
) => {
	return {
		color: states.textColorState?.color,
		defaultColor: states.textColorState?.defaultColor,
		palette: states.textColorState?.palette,
		disabled: states.textColorState?.disabled,
	};
};

export const FloatingToolbarComponent = ({
	api,
	editorView,
	dispatchAnalyticsEvent,
}: FloatingToolbarComponentProps): React.JSX.Element | null => {
	const { color, defaultColor, palette, disabled } = useSharedPluginStateWithSelector(
		api,
		['textColor'],
		selector,
	);

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
};
