import React from 'react';

import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI, ToolbarSize } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TextFormattingPlugin } from '../textFormattingPluginType';

import Toolbar from './Toolbar';
import { ToolbarType } from './Toolbar/types';

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<TextFormattingPlugin> | undefined) => {
		const isInitialised = useSharedPluginStateSelector(api, 'textFormatting.isInitialised');
		const formattingIsPresent = useSharedPluginStateSelector(
			api,
			'textFormatting.formattingIsPresent',
		);
		const emActive = useSharedPluginStateSelector(api, 'textFormatting.emActive');
		const emDisabled = useSharedPluginStateSelector(api, 'textFormatting.emDisabled');
		const emHidden = useSharedPluginStateSelector(api, 'textFormatting.emHidden');
		const codeActive = useSharedPluginStateSelector(api, 'textFormatting.codeActive');
		const codeDisabled = useSharedPluginStateSelector(api, 'textFormatting.codeDisabled');
		const codeHidden = useSharedPluginStateSelector(api, 'textFormatting.codeHidden');
		const underlineActive = useSharedPluginStateSelector(api, 'textFormatting.underlineActive');
		const underlineDisabled = useSharedPluginStateSelector(api, 'textFormatting.underlineDisabled');
		const underlineHidden = useSharedPluginStateSelector(api, 'textFormatting.underlineHidden');
		const strikeActive = useSharedPluginStateSelector(api, 'textFormatting.strikeActive');
		const strikeDisabled = useSharedPluginStateSelector(api, 'textFormatting.strikeDisabled');
		const strikeHidden = useSharedPluginStateSelector(api, 'textFormatting.strikeHidden');
		const strongActive = useSharedPluginStateSelector(api, 'textFormatting.strongActive');
		const strongDisabled = useSharedPluginStateSelector(api, 'textFormatting.strongDisabled');
		const strongHidden = useSharedPluginStateSelector(api, 'textFormatting.strongHidden');
		const superscriptActive = useSharedPluginStateSelector(api, 'textFormatting.superscriptActive');
		const superscriptDisabled = useSharedPluginStateSelector(
			api,
			'textFormatting.superscriptDisabled',
		);
		const superscriptHidden = useSharedPluginStateSelector(api, 'textFormatting.superscriptHidden');
		const subscriptActive = useSharedPluginStateSelector(api, 'textFormatting.subscriptActive');
		const subscriptDisabled = useSharedPluginStateSelector(api, 'textFormatting.subscriptDisabled');
		const subscriptHidden = useSharedPluginStateSelector(api, 'textFormatting.subscriptHidden');
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
	editorView: EditorView;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	toolbarSize: ToolbarSize;
	disabled: boolean;
	isReducedSpacing: boolean;
	shouldUseResponsiveToolbar: boolean;
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
