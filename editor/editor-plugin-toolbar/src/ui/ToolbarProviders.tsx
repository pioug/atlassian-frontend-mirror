import React, { useCallback } from 'react';

import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics/types/events';
import type { EditorToolbarContextType } from '@atlaskit/editor-common/toolbar/context';
import { EditorToolbarProvider } from '@atlaskit/editor-common/toolbar/context';
import { EditorToolbarUIProvider } from '@atlaskit/editor-common/toolbar/EditorToolbarUIProvider';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { ToolbarUIContextType } from '@atlaskit/editor-toolbar/ui-context';
import { useToolbarUI } from '@atlaskit/editor-toolbar/ui-context';

import type { ToolbarPlugin } from '../toolbarPluginType';

type ToolbarProvidersProps = {
	api?: ExtractInjectionAPI<ToolbarPlugin>;
	children: React.ReactNode;
	editorToolbarDockingPreference?: EditorToolbarContextType['editorToolbarDockingPreference'];
	editorView: EditorView;
	editorViewMode: 'edit' | 'view';
	isOffline: boolean;
	keyboardNavigation: ToolbarUIContextType['keyboardNavigation'];
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
};

/**
 * Editor and toolbar UI context shared by the floating toolbars (selection and element).
 */
export const ToolbarProviders = ({
	api,
	children,
	editorToolbarDockingPreference,
	editorView,
	editorViewMode,
	isOffline,
	keyboardNavigation,
	popupsBoundariesElement,
	popupsMountPoint,
	popupsScrollableElement,
}: ToolbarProvidersProps): React.JSX.Element => {
	const { isDisabled } = useToolbarUI();
	const fireAnalyticsEvent = useCallback(
		(payload: unknown) => {
			api?.analytics?.actions.fireAnalyticsEvent(payload as AnalyticsEventPayload);
		},
		[api],
	);

	return (
		<EditorToolbarProvider
			editorView={editorView}
			editorToolbarDockingPreference={editorToolbarDockingPreference}
			editorViewMode={editorViewMode}
			isOffline={isOffline}
		>
			<EditorToolbarUIProvider
				api={api}
				isDisabled={isDisabled}
				fireAnalyticsEvent={fireAnalyticsEvent}
				keyboardNavigation={keyboardNavigation}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
			>
				{children}
			</EditorToolbarUIProvider>
		</EditorToolbarProvider>
	);
};
