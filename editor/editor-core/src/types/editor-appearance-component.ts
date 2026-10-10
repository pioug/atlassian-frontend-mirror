import type { ReactElement, RefObject } from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics/types/dispatch-analytics-event';
import type { CollabEditOptions } from '@atlaskit/editor-common/collab';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions/extension-handler';
import type {
	AllEditorPresetPluginTypes,
	EditorPresetBuilder,
} from '@atlaskit/editor-common/preset/builder';
import type ProviderFactory from '@atlaskit/editor-common/provider-factory/provider-factory';
import type {
	EditorAppearance,
	EditorContentMode,
} from '@atlaskit/editor-common/types/editor-appearance';
import type { FeatureFlags } from '@atlaskit/editor-common/types/feature-flags';
import type {
	NextEditorPlugin,
	PublicPluginAPI,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types/toolbar';
import type {
	ReactHookFactory,
	UIComponentFactory,
} from '@atlaskit/editor-common/types/ui-components';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu/DropdownMenu/types';
import type { UseStickyToolbarType } from '@atlaskit/editor-common/ui-toolbar';
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
	contentMode?: EditorContentMode;
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
	isEditorModernisationEnabled?: boolean;

	maxHeight?: number;
	minHeight?: number;

	onCancel?: (editorView: EditorView) => void;
	onSave?: (editorView: EditorView) => void;
	onSSRMeasure?: (measure: {
		endTimestamp: number;
		segmentName: string;
		startTimestamp: number;
	}) => void;

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

	UNSAFE_containLayout?: boolean;

	useStickyToolbar?: UseStickyToolbarType;
}
