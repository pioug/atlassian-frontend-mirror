import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

export type CaptionPlugin = NextEditorPlugin<
  'caption',
  { dependencies: [typeof analyticsPlugin] }
>;
