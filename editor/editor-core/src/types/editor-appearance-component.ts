import type { ReactElement, RefObject } from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type {
	AllEditorPresetPluginTypes,
	EditorPresetBuilder,
} from '@atlaskit/editor-common/preset';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	EditorAppearance,
	FeatureFlags,
	NextEditorPlugin,
	PublicPluginAPI,
	ReactHookFactory,
	ToolbarUIComponentFactory,
	UIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { UseStickyToolbarType } from '@atlaskit/editor-common/ui';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type EditorActions from '../actions';
import type {
	ContentComponents,
	PrimaryToolbarComponents,
	ReactComponents,
} from '../types/editor-props';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditorAppearanceComponentProps<Plugins extends NextEditorPlugin<any, any>[]> {
	__livePage?: boolean;
	appearance?: EditorAppearance;
	collabEdit?: CollabEditOptions;
	contentComponents?: UIComponentFactory[];
	contextPanel?: ReactComponents;
	customContentComponents?: ContentComponents;

	customPrimaryToolbarComponents?: PrimaryToolbarComponents;
	customSecondaryToolbarComponents?: ReactComponents;
	disabled?: boolean;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;

	editorActions?: EditorActions;
	editorAPI: PublicPluginAPI<Plugins> | undefined;

	editorDOMElement: JSX.Element;
	editorView?: EditorView;

	enableToolbarMinWidth?: boolean;
	eventDispatcher?: EventDispatcher;
	extensionHandlers?: ExtensionHandlers;
	featureFlags: FeatureFlags;
	innerRef?: RefObject<HTMLDivElement>;

	insertMenuItems?: MenuItem[];
	maxHeight?: number;
	minHeight?: number;
	onCancel?: (editorView: EditorView) => void;
	onSave?: (editorView: EditorView) => void;

	persistScrollGutter?: boolean;
	pluginHooks?: ReactHookFactory[];
	popupsBoundariesElement?: HTMLElement;

	popupsMountPoint?: HTMLElement;

	popupsScrollableElement?: HTMLElement;

	preset?: EditorPresetBuilder<string[], AllEditorPresetPluginTypes[]>;

	primaryToolbarComponents?: ToolbarUIComponentFactory[];

	primaryToolbarIconBefore?: ReactElement;

	providerFactory: ProviderFactory;
	secondaryToolbarComponents?: UIComponentFactory[];

	useStickyToolbar?: UseStickyToolbarType;
}
