import React from 'react';

import {
	useSharedPluginStateWithSelector,
	type NamedPluginStatesFromInjectionAPI,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, ToolbarSize } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TextFormattingPlugin } from '../textFormattingPluginType';

import Toolbar from './Toolbar';
import { ToolbarType } from './Toolbar/types';

interface PrimaryToolbarComponentProps {
	api: ExtractInjectionAPI<TextFormattingPlugin> | undefined;
	disabled: boolean;
	editorView: EditorView;
	isReducedSpacing: boolean;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	shouldUseResponsiveToolbar: boolean;
	toolbarSize: ToolbarSize;
}

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<TextFormattingPlugin>,
		'textFormatting'
	>,
) => {
	return {
		isInitialised: Boolean(states.textFormattingState?.isInitialised),
		formattingIsPresent: states.textFormattingState?.formattingIsPresent,
		emActive: states.textFormattingState?.emActive,
		emDisabled: states.textFormattingState?.emDisabled,
		emHidden: states.textFormattingState?.emHidden,
		codeActive: states.textFormattingState?.codeActive,
		codeDisabled: states.textFormattingState?.codeDisabled,
		codeHidden: states.textFormattingState?.codeHidden,
		underlineActive: states.textFormattingState?.underlineActive,
		underlineDisabled: states.textFormattingState?.underlineDisabled,
		underlineHidden: states.textFormattingState?.underlineHidden,
		strikeActive: states.textFormattingState?.strikeActive,
		strikeDisabled: states.textFormattingState?.strikeDisabled,
		strikeHidden: states.textFormattingState?.strikeHidden,
		strongActive: states.textFormattingState?.strongActive,
		strongDisabled: states.textFormattingState?.strongDisabled,
		strongHidden: states.textFormattingState?.strongHidden,
		superscriptActive: states.textFormattingState?.superscriptActive,
		superscriptDisabled: states.textFormattingState?.superscriptDisabled,
		superscriptHidden: states.textFormattingState?.superscriptHidden,
		subscriptActive: states.textFormattingState?.subscriptActive,
		subscriptDisabled: states.textFormattingState?.subscriptDisabled,
		subscriptHidden: states.textFormattingState?.subscriptHidden,
	};
};

export const PrimaryToolbarComponent = React.memo(
	({
		api,
		popupsMountPoint,
		popupsScrollableElement,
		toolbarSize,
		editorView,
		disabled,
		isReducedSpacing,
		shouldUseResponsiveToolbar,
	}: PrimaryToolbarComponentProps) => {
		const textFormattingState = useSharedPluginStateWithSelector(api, ['textFormatting'], selector);

		return (
			<Toolbar
				textFormattingState={textFormattingState}
				popupsMountPoint={popupsMountPoint}
				popupsScrollableElement={popupsScrollableElement}
				toolbarSize={toolbarSize}
				isReducedSpacing={isReducedSpacing}
				editorView={editorView}
				isToolbarDisabled={disabled}
				shouldUseResponsiveToolbar={shouldUseResponsiveToolbar}
				editorAnalyticsAPI={api?.analytics?.actions}
				api={api}
				toolbarType={ToolbarType.PRIMARY}
			/>
		);
	},
);
