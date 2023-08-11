import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import type { gridPlugin } from '@atlaskit/editor-plugin-grid';
import type { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { MediaPluginState } from './pm-plugins/types';
import type { FloatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { FocusPlugin } from '@atlaskit/editor-plugin-focus';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { MediaOptions } from './types';

export type MediaNextEditorPluginType = NextEditorPlugin<
  'media',
  {
    pluginConfiguration: MediaOptions | undefined;
    dependencies: [
      typeof featureFlagsPlugin,
      OptionalPlugin<typeof analyticsPlugin>,
      typeof guidelinePlugin,
      typeof gridPlugin,
      typeof widthPlugin,
      typeof decorationsPlugin,
      FloatingToolbarPlugin,
      EditorDisabledPlugin,
      FocusPlugin,
    ];
    sharedState: MediaPluginState | null;
  }
>;
