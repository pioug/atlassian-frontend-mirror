import type {
  EditorCommand,
  QuickInsertSearchOptions,
} from '@atlaskit/editor-common/types';
import { pluginKey } from './plugin-key';

export type QuickInsertSearch = (
  searchOptions: QuickInsertSearchOptions,
) => EditorCommand;

export const search: QuickInsertSearch =
  ({ query, category, disableDefaultItems, featuredItems }) =>
  ({ tr }) =>
    tr.setMeta(pluginKey, {
      searchOptions: { query, category, disableDefaultItems, featuredItems },
    });
