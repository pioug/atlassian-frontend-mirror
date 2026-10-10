import type { MediaADFAttrs } from '@atlaskit/adf-schema/media';
import type {
	InputMethodInsertMedia,
	InsertMediaVia,
} from '@atlaskit/editor-common/analytics/types/insert-events';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory/media-provider';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { AnnotationPlugin } from '@atlaskit/editor-plugin-annotation/annotationPluginType';
import type { ConnectivityPlugin } from '@atlaskit/editor-plugin-connectivity/connectivityPluginType';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier/contextIdentifierPluginType';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations/decorationsPluginType';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags/featureFlagsPluginType';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar/floatingToolbarPluginType';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus/focusPluginType';
import type { GridPlugin } from '@atlaskit/editor-plugin-grid/gridPluginType';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline/guidelinePluginType';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction/interaction-plugin-type';
import type { LimitedModePlugin } from '@atlaskit/editor-plugin-limited-mode/limited-mode-plugin-type';
import type { MediaEditingPlugin } from '@atlaskit/editor-plugin-media-editing/media-editing-plugin-type';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width/width-plugin-type';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { AIGeneratingSource } from './pm-plugins/ai-generating-decoration';
import type { MediaPluginState } from './pm-plugins/types';
import type { InsertMediaAsMediaSingle } from './pm-plugins/utils/media-single';
import type { MediaOptions } from './types';

// Import MediaInsertPlugin type dynamically to avoid circular dependency
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MediaInsertPlugin = NextEditorPlugin<'mediaInsert', any>;

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
	OptionalPlugin<MediaInsertPlugin>,
	OptionalPlugin<InteractionPlugin>,
	SelectionPlugin,
	OptionalPlugin<AnnotationPlugin>,
	OptionalPlugin<FeatureFlagsPlugin>,
	OptionalPlugin<ConnectivityPlugin>,
	OptionalPlugin<InteractionPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<MediaEditingPlugin>,
	OptionalPlugin<LimitedModePlugin>,
];

export type MediaNextEditorPluginType = NextEditorPlugin<
	'media',
	{
		actions: {
			/**
			 * Callback to be called when there is an error rendering a media node.
			 */
			handleMediaNodeRenderError: (node: PMNode, reason: string, nestedUnder?: string) => void;
			/**
			 * @private
			 * @deprecated Use the command `insertMediaSingle` instead which is decoupled from EditorView
			 * and easier to use.
			 */
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
			/**
			 * Clears the AI-generating decoration for a specific media node identified by
			 * `mediaId`. Removes the AI border from that media node.
			 */
			clearAIGenerating: (mediaId: string) => EditorCommand;
			hideMediaViewer: EditorCommand;
			/**
			 * Inserts a media node as a media single.
			 * This command creates a media single node from a set of attributes
			 *
			 * @param attrs - The media node attributes of the node to insert
			 * @param inputMethod - The method used to input the media
			 * @param insertMediaVia - Optional parameter indicating how the media was inserted
			 * @param positions - Optional parameter indicating the positions for the insertion
			 */
			insertMediaSingle: (
				attrs: MediaADFAttrs,
				inputMethod: InputMethodInsertMedia,
				insertMediaVia?: InsertMediaVia,
				positions?: [number, number],
				dataConsumerSource?: string,
			) => EditorCommand;
			/**
			 * Sets the AI-generating decoration on a media node identified by `mediaId`.
			 * Renders an AI border around the media node while AI is generating/replacing it.
			 *
			 * Decorations live in the view layer only and never affect the document model
			 * or undo/redo history.
			 */
			setAIGenerating: (mediaId: string, source?: AIGeneratingSource) => EditorCommand;
			showMediaViewer: (media: MediaADFAttrs) => EditorCommand;
			trackMediaPaste: (attrs: MediaADFAttrs) => EditorCommand;
		};
		dependencies: MediaPluginDependencies;
		pluginConfiguration: MediaOptions | undefined;
		sharedState: MediaPluginState | null;
	}
>;
