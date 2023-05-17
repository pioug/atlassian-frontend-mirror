import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

import type { InsertNodeAPI } from '../types';

import { handleInsertContent } from './insert-content-handlers';

export type CreateInsertNodeAPIProps = {};

export const createInsertNodeAPI = (
  analyticsApi: EditorAnalyticsAPI | undefined,
): InsertNodeAPI => ({
  insert: ({ state, dispatch, node, options }) => {
    if (!state || !dispatch) {
      return false;
    }

    const { tr } = state;

    handleInsertContent({ node, options })(tr);

    if (options.analyticsPayload) {
      analyticsApi?.attachAnalyticsEvent(options.analyticsPayload)(tr);
    }

    dispatch(tr);

    return true;
  },
});
