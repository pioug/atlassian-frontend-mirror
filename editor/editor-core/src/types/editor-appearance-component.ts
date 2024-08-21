import type { ReactElement, RefObject } from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
	NextEditorPlugin,
	PublicPluginAPI,
	ReactHookFactory,
} from '@atlaskit/editor-common/types';
import type { UseStickyToolbarType } from '@atlaskit/editor-common/ui';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type EditorActions from '../actions';
import type { EventDispatcher } from '../event-dispatcher';
import type {
	ContentComponents,
	PrimaryToolbarComponents,
	ReactComponents,
} from '../types/editor-props';
import type { UIComponentFactory } from '../types/ui-components';
import type { ToolbarUIComponentFactory } from '../ui/Toolbar/types';

import type { EditorAppearance } from './editor-appearance';
import type { FeatureFlags } from './feature-flags';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditorAppearanceComponentProps<Plugins extends NextEditorPlugin<any, any>[]> {
	editorAPI: PublicPluginAPI<Plugins> | undefined;
	appearance?: EditorAppearance;
	onSave?: (editorView: EditorView) => void;
	onCancel?: (editorView: EditorView) => void;

	providerFactory: ProviderFactory;
	editorActions?: EditorActions;
	editorDOMElement: JSX.Element;
	editorView?: EditorView;

	eventDispatcher?: EventDispatcher;
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent;

	maxHeight?: number;
	minHeight?: number;

	contentComponents?: UIComponentFactory[];
	pluginHooks?: ReactHookFactory[];
	primaryToolbarComponents?: ToolbarUIComponentFactory[];
	primaryToolbarIconBefore?: ReactElement;
	secondaryToolbarComponents?: UIComponentFactory[];

	customContentComponents?: ContentComponents;
	customPrimaryToolbarComponents?: PrimaryToolbarComponents;
	customSecondaryToolbarComponents?: ReactComponents;
	insertMenuItems?: MenuItem[];
	contextPanel?: ReactComponents;

	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;

	extensionHandlers?: ExtensionHandlers;

	disabled?: boolean;

	collabEdit?: CollabEditOptions;

	persistScrollGutter?: boolean;

	enableToolbarMinWidth?: boolean;

	featureFlags: FeatureFlags;
	useStickyToolbar?: UseStickyToolbarType;

	innerRef?: RefObject<HTMLDivElement>;
	hideAvatarGroup?: boolean;
}
