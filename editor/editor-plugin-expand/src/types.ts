import type {
  EditorAppearance,
  LongPressSelectionPluginOptions,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
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
  /**
   * Allows the expand button to toggle. Previously this was set via the editor prop featureFlag (`interactiveExpand`)
   *
   * Defaults to true
   */
  allowInteractiveExpand?: boolean;
  appearance?: EditorAppearance;
}

export type ExpandPlugin = NextEditorPlugin<
  'expand',
  {
    pluginConfiguration: ExpandPluginOptions | undefined;
    dependencies: [
      DecorationsPlugin,
      SelectionPlugin,
      OptionalPlugin<AnalyticsPlugin>,
    ];
    actions: {
      insertExpand: ReturnType<typeof insertExpand>;
    };
  }
>;
