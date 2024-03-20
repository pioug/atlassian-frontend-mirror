import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { AnnotationPlugin } from '@atlaskit/editor-plugin-annotation';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type { GridPlugin } from '@atlaskit/editor-plugin-grid';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

import type { MediaPluginState } from './pm-plugins/types';
import type { MediaOptions } from './types';
import type { InsertMediaAsMediaSingle } from './utils/media-single';

export type MediaNextEditorPluginType = NextEditorPlugin<
  'media',
  {
    pluginConfiguration: MediaOptions | undefined;
    dependencies: [
      OptionalPlugin<AnalyticsPlugin>,
      OptionalPlugin<ContextIdentifierPlugin>,
      OptionalPlugin<EditorViewModePlugin>,
      GuidelinePlugin,
      GridPlugin,
      WidthPlugin,
      DecorationsPlugin,
      FloatingToolbarPlugin,
      EditorDisabledPlugin,
      FocusPlugin,
      SelectionPlugin,
      OptionalPlugin<AnnotationPlugin>,
    ];
    sharedState: MediaPluginState | null;
    actions: {
      insertMediaAsMediaSingle: InsertMediaAsMediaSingle;
    };
  }
>;
