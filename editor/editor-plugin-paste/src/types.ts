import type { CardOptions } from '@atlaskit/editor-common/card';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BetterTypeHistoryPlugin } from '@atlaskit/editor-plugin-better-type-history';
import type { CardPlugin } from '@atlaskit/editor-plugin-card';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';

export interface PastePluginState {
  /** map of pasted macro link positions that will to be mapped through incoming transactions */
  pastedMacroPositions: { [key: string]: number };
}

export type PastePluginOptions = {
  cardOptions?: CardOptions;
  sanitizePrivateContent?: boolean;
};

export type PastePlugin = NextEditorPlugin<
  'paste',
  {
    pluginConfiguration: PastePluginOptions;
    dependencies: [
      FeatureFlagsPlugin,
      OptionalPlugin<ListPlugin>,
      BetterTypeHistoryPlugin,
      OptionalPlugin<CardPlugin>,
      OptionalPlugin<AnalyticsPlugin>,
      OptionalPlugin<MediaPlugin>,
    ];
  }
>;
