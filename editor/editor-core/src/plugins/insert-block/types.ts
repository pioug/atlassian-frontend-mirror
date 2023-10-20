import type { OptionalPlugin } from '@atlaskit/editor-common/types';

import type { ImageUploadPlugin } from '@atlaskit/editor-plugin-image-upload';

import type { EmojiPlugin } from '@atlaskit/editor-plugin-emoji';
import type { DatePlugin } from '@atlaskit/editor-plugin-date';
import type { tablesPlugin } from '@atlaskit/editor-plugin-table';
import type { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';

import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import type { BlockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import type codeBlockPlugin from '../code-block';
import type panelPlugin from '../panel';
import type { LayoutPlugin } from '../layout';
import type { RulePlugin } from '@atlaskit/editor-plugin-rule';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import type { StatusPlugin } from '@atlaskit/editor-plugin-status';

export type InsertBlockPluginDependencies = [
  FeatureFlagsPlugin,
  TypeAheadPlugin,
  OptionalPlugin<typeof tablesPlugin>,
  OptionalPlugin<typeof hyperlinkPlugin>,
  OptionalPlugin<DatePlugin>,
  OptionalPlugin<BlockTypePlugin>,
  OptionalPlugin<typeof analyticsPlugin>,
  OptionalPlugin<ImageUploadPlugin>,
  OptionalPlugin<EmojiPlugin>,
  OptionalPlugin<QuickInsertPlugin>,
  OptionalPlugin<RulePlugin>,
  OptionalPlugin<typeof codeBlockPlugin>,
  OptionalPlugin<typeof panelPlugin>,
  OptionalPlugin<MediaPlugin>,
  OptionalPlugin<MentionsPlugin>,
  OptionalPlugin<StatusPlugin>,
  OptionalPlugin<LayoutPlugin>,
];
