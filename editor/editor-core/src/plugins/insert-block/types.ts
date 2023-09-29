import type { OptionalPlugin } from '@atlaskit/editor-common/types';

import type { ImageUploadPlugin } from '@atlaskit/editor-plugin-image-upload';

import type { EmojiPlugin } from '@atlaskit/editor-plugin-emoji';
import type datePlugin from '../date';
import type { tablesPlugin } from '@atlaskit/editor-plugin-table';
import type { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';

import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type mentionsPlugin from '../mentions';
import type { QuickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import type { BlockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import type codeBlockPlugin from '../code-block';
import type panelPlugin from '../panel';
import type { RulePlugin } from '@atlaskit/editor-plugin-rule';
import type { MediaNextEditorPluginType } from '../media/next-plugin-type';

export type InsertBlockPluginDependencies = [
  FeatureFlagsPlugin,
  OptionalPlugin<typeof tablesPlugin>,
  OptionalPlugin<typeof hyperlinkPlugin>,
  OptionalPlugin<typeof datePlugin>,
  OptionalPlugin<BlockTypePlugin>,
  OptionalPlugin<typeof analyticsPlugin>,
  OptionalPlugin<ImageUploadPlugin>,
  OptionalPlugin<typeof mentionsPlugin>,
  OptionalPlugin<EmojiPlugin>,
  OptionalPlugin<QuickInsertPlugin>,
  OptionalPlugin<RulePlugin>,
  OptionalPlugin<typeof codeBlockPlugin>,
  OptionalPlugin<typeof panelPlugin>,
  OptionalPlugin<MediaNextEditorPluginType>,
];
