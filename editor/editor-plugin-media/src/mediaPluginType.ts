import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { AnnotationPlugin } from '@atlaskit/editor-plugin-annotation';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type { GridPlugin } from '@atlaskit/editor-plugin-grid';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';
import type { MediaEditingPlugin } from '@atlaskit/editor-plugin-media-editing';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { MediaPluginState } from './pm-plugins/types';
import type { InsertMediaAsMediaSingle } from './pm-plugins/utils/media-single';
import type { MediaOptions } from './types';

export type MediaPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<ContextIdentifierPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<GuidelinePlugin>,
	GridPlugin,
	WidthPlugin,
	DecorationsPlugin,
	FloatingToolbarPlugin,
	EditorDisabledPlugin,
	FocusPlugin,
	OptionalPlugin<InteractionPlugin>,
	SelectionPlugin,
	OptionalPlugin<AnnotationPlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<ConnectivityPlugin>,
	OptionalPlugin<InteractionPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<MediaEditingPlugin>,
];

export type MediaNextEditorPluginType = NextEditorPlugin<
	'media',
	{
		actions: {
			/**
			 * Callback to be called when there is an error rendering a media node.
			 */
			handleMediaNodeRenderError: (node: PMNode, reason: string) => void;
			insertMediaAsMediaSingle: InsertMediaAsMediaSingle;
			/**
			 * Used to update the initial provider passed to the media plugin.
			 *
			 * For performance reasons if you attempt to set the same provider more
			 * than once this method will fail and return false.
			 *
			 * @param provider Promise<MediaProvider>
			 * @returns {boolean} if setting the provider was successful or not
			 */
			setProvider: (provider: Promise<MediaProvider>) => boolean;
		};
		commands: {
			hideMediaViewer: EditorCommand;
			showMediaViewer: (media: MediaADFAttrs) => EditorCommand;
			trackMediaPaste: (attrs: MediaADFAttrs) => EditorCommand;
		};
		dependencies: MediaPluginDependencies;
		pluginConfiguration: MediaOptions | undefined;
		sharedState: MediaPluginState | null;
	}
>;
