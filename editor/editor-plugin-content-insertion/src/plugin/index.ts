import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import type { InsertNodeAPI } from '../types';

import { createInsertNodeAPI } from './api';

export const contentInsertionPlugin: NextEditorPlugin<
  'contentInsertion',
  {
    actions: InsertNodeAPI;
    dependencies: [typeof analyticsPlugin];
  }
> = (_, api) => {
  return {
    name: 'contentInsertion',

    actions: createInsertNodeAPI(api?.dependencies.analytics?.actions),
  };
};
