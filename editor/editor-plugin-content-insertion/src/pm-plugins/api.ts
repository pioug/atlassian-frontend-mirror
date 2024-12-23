import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

import type { InsertNodeAPI } from '../types';

import { handleInsertContent } from './insert-content-handlers';

export type CreateInsertNodeAPIProps = Object;

export const createInsertNodeAPI = (
	analyticsApi: EditorAnalyticsAPI | undefined,
): InsertNodeAPI => ({
	actions: {
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
	},
	commands: {
		insert:
			({ node, options }) =>
			({ tr }) => {
				handleInsertContent({ node, options })(tr);

				if (options.analyticsPayload) {
					analyticsApi?.attachAnalyticsEvent(options.analyticsPayload)(tr);
				}

				return tr;
			},
	},
});
