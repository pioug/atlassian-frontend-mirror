import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import type { GridPlugin } from '@atlaskit/editor-plugin-grid';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { MediaPluginState } from './pm-plugins/types';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';

import type { InsertMediaAsMediaSingle } from './utils/media-single';
import type { MediaOptions } from './types';

export type MediaNextEditorPluginType = NextEditorPlugin<
  'media',
  {
    pluginConfiguration: MediaOptions | undefined;
    dependencies: [
      FeatureFlagsPlugin,
      OptionalPlugin<AnalyticsPlugin>,
      GuidelinePlugin,
      GridPlugin,
      WidthPlugin,
      DecorationsPlugin,
      FloatingToolbarPlugin,
      EditorDisabledPlugin,
      FocusPlugin,
    ];
    sharedState: MediaPluginState | null;
    actions: {
      insertMediaAsMediaSingle: InsertMediaAsMediaSingle;
    };
  }
>;
