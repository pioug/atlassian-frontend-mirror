import type { OptionalPlugin } from '@atlaskit/editor-common/types';

import type { ImageUploadPlugin } from '@atlaskit/editor-plugin-image-upload';

import type { EmojiPlugin } from '../emoji';
import type datePlugin from '../date';
import type { tablesPlugin } from '@atlaskit/editor-plugin-table';
import type { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';

import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type mentionsPlugin from '../mentions';

export type InsertBlockPluginDependencies = [
  typeof featureFlagsPlugin,
  OptionalPlugin<typeof tablesPlugin>,
  OptionalPlugin<typeof hyperlinkPlugin>,
  OptionalPlugin<typeof datePlugin>,
  OptionalPlugin<typeof analyticsPlugin>,
  OptionalPlugin<ImageUploadPlugin>,
  OptionalPlugin<typeof mentionsPlugin>,
  OptionalPlugin<EmojiPlugin>,
];
