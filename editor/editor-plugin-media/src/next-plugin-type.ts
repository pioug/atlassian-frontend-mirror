import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
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
      OptionalPlugin<FeatureFlagsPlugin>,
      OptionalPlugin<AnalyticsPlugin>,
      GuidelinePlugin,
      GridPlugin,
      WidthPlugin,
      DecorationsPlugin,
      FloatingToolbarPlugin,
      EditorDisabledPlugin,
      FocusPlugin,
      SelectionPlugin,
    ];
    sharedState: MediaPluginState | null;
    actions: {
      insertMediaAsMediaSingle: InsertMediaAsMediaSingle;
    };
  }
>;
