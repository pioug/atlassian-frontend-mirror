import type {
  Command,
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type {
  TextColorPluginConfig,
  TextColorPluginState,
} from './pm-plugins/main';

type Config = TextColorPluginConfig | boolean;

export type TextColorPlugin = NextEditorPlugin<
  'textColor',
  {
    pluginConfiguration: Config | undefined;
    dependencies: [OptionalPlugin<AnalyticsPlugin>];
    actions: {
      changeColor: (color: string) => Command;
    };
    sharedState: TextColorPluginState | undefined;
  }
>;
