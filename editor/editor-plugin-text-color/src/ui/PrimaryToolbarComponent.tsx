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

interface PrimaryToolbarComponentProps {
	api: ExtractInjectionAPI<TextColorPlugin> | undefined;
	disabled: boolean;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
	editorView: EditorView;
	isReducedSpacing: boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
}

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

export const PrimaryToolbarComponent = ({
	api,
	isReducedSpacing,
	editorView,
	popupsMountPoint,
	popupsScrollableElement,
	popupsBoundariesElement,
	dispatchAnalyticsEvent,
	disabled,
}: PrimaryToolbarComponentProps) => {
	const {
		color,
		defaultColor,
		palette,
		disabled: textColorDisabled,
	} = useSharedPluginStateWithSelector(api, ['textColor'], selector);

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
};
