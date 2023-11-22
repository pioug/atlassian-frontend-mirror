import type {
  EditorAppearance,
  LongPressSelectionPluginOptions,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';

import type { insertExpand } from './commands';

export interface ExpandPluginState {
  expandRef?: HTMLDivElement | null;
}

export type ExpandPluginAction = {
  type: 'SET_EXPAND_REF';
  data: {
    ref?: HTMLDivElement | null;
  };
};

export interface ExpandPluginOptions extends LongPressSelectionPluginOptions {
  allowInsertion?: boolean;
  appearance?: EditorAppearance;
}

export type ExpandPlugin = NextEditorPlugin<
  'expand',
  {
    pluginConfiguration: ExpandPluginOptions | undefined;
    dependencies: [
      OptionalPlugin<FeatureFlagsPlugin>,
      DecorationsPlugin,
      SelectionPlugin,
      OptionalPlugin<AnalyticsPlugin>,
    ];
    actions: {
      insertExpand: ReturnType<typeof insertExpand>;
    };
  }
>;
