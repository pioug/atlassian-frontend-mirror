import { backgroundColor } from '@atlaskit/adf-schema';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type BackgroundColorPlugin = NextEditorPlugin<'backgroundColor'>;

export const backgroundColorPlugin: BackgroundColorPlugin = () => {
	return {
		name: 'backgroundColor',

		// This is defined in a separate plugin because removing a schema mark (by toggling off a feature for example)
		// would result in broken pages in Confluence where the mark is used. The unsupported mark logic does not
		// work for any products using NCS as their collab service.
		// We can collapse this into the highlight plugin once we're done experimenting with it and we know it's rolled
		// out to a 100% of the audience and will never be rolled back.
		marks() {
			return [{ name: 'backgroundColor', mark: backgroundColor }];
		},
	};
};
