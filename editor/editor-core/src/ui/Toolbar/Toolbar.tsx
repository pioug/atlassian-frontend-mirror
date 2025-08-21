import React from 'react';

import type { EditorToolbarContextType } from '@atlaskit/editor-common/toolbar';
import { EditorToolbarProvider, EditorToolbarUIProvider } from '@atlaskit/editor-common/toolbar';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { ToolbarSize } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
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

type NewToolbarProps = Pick<ToolbarUIContextType, 'popupsMountPoint'> &
	Pick<EditorToolbarContextType, 'editorAppearance'> & {
		toolbar: RegisterToolbar;
		components: RegisterComponent[];
		editorView?: EditorView;
		editorAPI?: PublicPluginAPI<[ToolbarPlugin]>;
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
}: NewToolbarProps) => {
	const connectivityStateMode = useSharedPluginStateSelector(editorAPI, 'connectivity.mode');
	const isOffline = connectivityStateMode === 'offline';

	return (
		<EditorToolbarProvider editorView={editorView ?? null} editorAppearance={editorAppearance}>
			<EditorToolbarUIProvider
				api={editorAPI}
				isDisabled={isOffline}
				popupsMountPoint={popupsMountPoint}
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
