import React from 'react';

import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, ToolbarSize } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TextFormattingPlugin } from '../textFormattingPluginType';

import Toolbar from './Toolbar';
import { ToolbarType } from './Toolbar/types';

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<TextFormattingPlugin> | undefined) => {
		const {
			codeActive,
			codeDisabled,
			codeHidden,
			emActive,
			emDisabled,
			emHidden,
			formattingIsPresent,
			isInitialised,
			strikeActive,
			strikeDisabled,
			strikeHidden,
			strongActive,
			strongDisabled,
			strongHidden,
			subscriptActive,
			subscriptDisabled,
			subscriptHidden,
			superscriptActive,
			superscriptDisabled,
			superscriptHidden,
			underlineActive,
			underlineDisabled,
			underlineHidden,
		} = useSharedPluginStateWithSelector(api, ['textFormatting'], (states) => ({
			isInitialised: states.textFormattingState?.isInitialised,
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
		}));
		return {
			isInitialised: Boolean(isInitialised),
			formattingIsPresent,
			emActive,
			emDisabled,
			emHidden,
			codeActive,
			codeDisabled,
			codeHidden,
			underlineActive,
			underlineDisabled,
			underlineHidden,
			strikeActive,
			strikeDisabled,
			strikeHidden,
			strongActive,
			strongDisabled,
			strongHidden,
			superscriptActive,
			superscriptDisabled,
			superscriptHidden,
			subscriptActive,
			subscriptDisabled,
			subscriptHidden,
		};
	},
	(api: ExtractInjectionAPI<TextFormattingPlugin> | undefined) => {
		const { textFormattingState } = useSharedPluginState(api, ['textFormatting']);
		return {
			isInitialised: Boolean(textFormattingState?.isInitialised),
			formattingIsPresent: textFormattingState?.formattingIsPresent,
			emActive: textFormattingState?.emActive,
			emDisabled: textFormattingState?.emDisabled,
			emHidden: textFormattingState?.emHidden,
			codeActive: textFormattingState?.codeActive,
			codeDisabled: textFormattingState?.codeDisabled,
			codeHidden: textFormattingState?.codeHidden,
			underlineActive: textFormattingState?.underlineActive,
			underlineDisabled: textFormattingState?.underlineDisabled,
			underlineHidden: textFormattingState?.underlineHidden,
			strikeActive: textFormattingState?.strikeActive,
			strikeDisabled: textFormattingState?.strikeDisabled,
			strikeHidden: textFormattingState?.strikeHidden,
			strongActive: textFormattingState?.strongActive,
			strongDisabled: textFormattingState?.strongDisabled,
			strongHidden: textFormattingState?.strongHidden,
			superscriptActive: textFormattingState?.superscriptActive,
			superscriptDisabled: textFormattingState?.superscriptDisabled,
			superscriptHidden: textFormattingState?.superscriptHidden,
			subscriptActive: textFormattingState?.subscriptActive,
			subscriptDisabled: textFormattingState?.subscriptDisabled,
			subscriptHidden: textFormattingState?.subscriptHidden,
		};
	},
);

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
export function PrimaryToolbarComponent({
	api,
	popupsMountPoint,
	popupsScrollableElement,
	toolbarSize,
	editorView,
	disabled,
	isReducedSpacing,
	shouldUseResponsiveToolbar,
}: PrimaryToolbarComponentProps) {
	const textFormattingState = useSharedState(api);
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
}

export const PrimaryToolbarComponentMemoized = React.memo(PrimaryToolbarComponent);
