import React from 'react';

import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { EditorToolbarContextType } from '@atlaskit/editor-common/toolbar';
import { EditorToolbarProvider, EditorToolbarUIProvider } from '@atlaskit/editor-common/toolbar';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	ToolbarButtonGroup,
	ToolbarDropdownItemSection,
	ToolbarSection,
	type ToolbarUIContextType,
} from '@atlaskit/editor-toolbar';
import { ToolbarModelRenderer } from '@atlaskit/editor-toolbar-model';
import type { RegisterComponent, RegisterToolbar } from '@atlaskit/editor-toolbar-model';

import type { ToolbarProps } from './toolbar-types';
import { ToolbarInner } from './ToolbarInner';

/**
 * *Warning:* With `platform_editor_toolbar_aifc` enabled this component is no longer used and is replaced with `<ToolbarNext />`.
 *
 * If making changes to this component please ensure to also update `<ToolbarNext />`.
 */
export const Toolbar = (props: ToolbarProps): JSX.Element => {
	return (
		<ToolbarInner
			items={props.items}
			editorView={props.editorView}
			editorActions={props.editorActions}
			eventDispatcher={props.eventDispatcher}
			providerFactory={props.providerFactory}
			appearance={props.appearance}
			popupsMountPoint={props.popupsMountPoint}
			popupsBoundariesElement={props.popupsBoundariesElement}
			popupsScrollableElement={props.popupsScrollableElement}
			disabled={props.disabled}
			dispatchAnalyticsEvent={props.dispatchAnalyticsEvent}
			toolbarSize={props.toolbarSize}
			isToolbarReducedSpacing={props.toolbarSize < ToolbarSize.XXL}
			containerElement={props.containerElement}
		/>
	);
};

type NewToolbarProps = Pick<
	ToolbarUIContextType,
	'popupsMountPoint' | 'popupsBoundariesElement' | 'popupsScrollableElement' | 'isDisabled'
> &
	Pick<EditorToolbarContextType, 'editorAppearance'> & {
		components: RegisterComponent[];
		editorAPI?: PublicPluginAPI<[ToolbarPlugin]>;
		editorView?: EditorView;
		toolbar: RegisterToolbar;
	};

const usePluginState = (api?: PublicPluginAPI<[ToolbarPlugin]>) => {
	return useSharedPluginStateWithSelector(
		api,
		['connectivity', 'editorViewMode', 'userPreferences'],
		(state) => {
			return {
				connectivityStateMode: state.connectivityState?.mode,
				editorViewMode: state.editorViewModeState?.mode,
				editorToolbarDockingPreference:
					state.userPreferencesState?.preferences?.toolbarDockingPosition,
			};
		},
	);
};

/**
 * Renders a primary toolbar, driven by components registed by `editor-plugin-toolbar`. `ToolbarModelRenderer` will just
 * render the toolbar structure, the design is driven per component registered including the toolbar itself.
 *
 * The majority of components UI should use `@atlaskit/editor-toolbar` components.
 */
export const ToolbarNext = ({
	toolbar,
	components,
	editorView,
	editorAPI,
	popupsMountPoint,
	editorAppearance,
	popupsBoundariesElement,
	popupsScrollableElement,
	isDisabled,
}: NewToolbarProps): React.JSX.Element => {
	const { connectivityStateMode, editorViewMode, editorToolbarDockingPreference } =
		usePluginState(editorAPI);
	// remove offline check when patch6Enabled is cleaned up
	const isOffline = isOfflineMode(connectivityStateMode);


	return (
		<EditorToolbarProvider
			editorView={editorView ?? null}
			editorAppearance={editorAppearance}
			editorViewMode={editorViewMode ?? 'edit'}
			editorToolbarDockingPreference={editorToolbarDockingPreference}
			isOffline={isOffline}
		>
			<EditorToolbarUIProvider
				api={editorAPI}
				isDisabled={isDisabled}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				fireAnalyticsEvent={(payload: unknown) => {
					editorAPI?.analytics?.actions.fireAnalyticsEvent(payload as AnalyticsEventPayload);
				}}
			>
				<ToolbarModelRenderer
					toolbar={toolbar}
					components={components}
					fallbacks={{
						group: ToolbarButtonGroup,
						section: ToolbarSection,
						menuSection: ToolbarDropdownItemSection,
					}}
				/>
			</EditorToolbarUIProvider>
		</EditorToolbarProvider>
	);
};
