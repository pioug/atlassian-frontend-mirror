import type { OptionalPlugin } from '@atlaskit/editor-common/types';

import type { ImageUploadPlugin } from '@atlaskit/editor-plugin-image-upload';

import type { EmojiPlugin } from '@atlaskit/editor-plugin-emoji';
import type datePlugin from '../date';
import type { tablesPlugin } from '@atlaskit/editor-plugin-table';
import type { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';

import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type mentionsPlugin from '../mentions';
import type quickInsertPlugin from '../quick-insert';
import type blockTypePlugin from '../block-type';
import type codeBlockPlugin from '../code-block';
import type panelPlugin from '../panel';

export type InsertBlockPluginDependencies = [
  FeatureFlagsPlugin,
  OptionalPlugin<typeof tablesPlugin>,
  OptionalPlugin<typeof hyperlinkPlugin>,
  OptionalPlugin<typeof datePlugin>,
  OptionalPlugin<typeof blockTypePlugin>,
  OptionalPlugin<typeof analyticsPlugin>,
  OptionalPlugin<ImageUploadPlugin>,
  OptionalPlugin<typeof mentionsPlugin>,
  OptionalPlugin<EmojiPlugin>,
  OptionalPlugin<typeof quickInsertPlugin>,
  OptionalPlugin<typeof codeBlockPlugin>,
  OptionalPlugin<typeof panelPlugin>,
];
