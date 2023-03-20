import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { InsertNodeAPI } from '../insert-api/types';
import { EditorPlugin, EditorProps, EditorAppearance } from '../types';

export type GetEditorPluginsProps = {
  props: EditorProps;
  prevAppearance?: EditorAppearance;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  insertNodeAPI?: InsertNodeAPI;
  editorAnalyticsAPI?: EditorAnalyticsAPI;
};

export type GetEditorPlugins = (props: GetEditorPluginsProps) => EditorPlugin[];
