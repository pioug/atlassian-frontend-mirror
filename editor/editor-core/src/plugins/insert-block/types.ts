import type { OptionalPlugin } from '@atlaskit/editor-common/types';

import type { ImageUploadPlugin } from '@atlaskit/editor-plugin-image-upload';

import type { EmojiPlugin } from '@atlaskit/editor-plugin-emoji';
import type { DatePlugin } from '@atlaskit/editor-plugin-date';
import type { TablePlugin } from '@atlaskit/editor-plugin-table';
import type { HyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import type { BlockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import type { CodeBlockPlugin } from '@atlaskit/editor-plugin-code-block';
import type { PanelPlugin } from '@atlaskit/editor-plugin-panel';
import type { LayoutPlugin } from '@atlaskit/editor-plugin-layout';
import type { RulePlugin } from '@atlaskit/editor-plugin-rule';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import type { StatusPlugin } from '@atlaskit/editor-plugin-status';
import type { PlaceholderTextPlugin } from '@atlaskit/editor-plugin-placeholder-text';
import type { ExpandPlugin } from '@atlaskit/editor-plugin-expand';
import type { TaskAndDecisionsPlugin } from '../tasks-and-decisions/types';

export type InsertBlockPluginDependencies = [
  FeatureFlagsPlugin,
  TypeAheadPlugin,
  OptionalPlugin<TablePlugin>,
  OptionalPlugin<HyperlinkPlugin>,
  OptionalPlugin<DatePlugin>,
  OptionalPlugin<BlockTypePlugin>,
  OptionalPlugin<AnalyticsPlugin>,
  OptionalPlugin<ImageUploadPlugin>,
  OptionalPlugin<EmojiPlugin>,
  OptionalPlugin<QuickInsertPlugin>,
  OptionalPlugin<RulePlugin>,
  OptionalPlugin<CodeBlockPlugin>,
  OptionalPlugin<PanelPlugin>,
  OptionalPlugin<MediaPlugin>,
  OptionalPlugin<MentionsPlugin>,
  OptionalPlugin<StatusPlugin>,
  OptionalPlugin<LayoutPlugin>,
  OptionalPlugin<ExpandPlugin>,
  OptionalPlugin<PlaceholderTextPlugin>,
  OptionalPlugin<ExtensionPlugin>,
  OptionalPlugin<TaskAndDecisionsPlugin>,
];
