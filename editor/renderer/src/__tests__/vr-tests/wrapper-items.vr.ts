import { snapshot } from '@af/visual-regression';

import { WrapperItemsCommentRenderer, WrapperItemsRenderer } from './wrapper-items.fixture';

snapshot(WrapperItemsRenderer, {
	description: 'wrapper items should not show markers in full-page renderer',
	featureFlags: {
		platform_editor_flexible_list_indentation: true,
	},
});

snapshot(WrapperItemsCommentRenderer, {
	description: 'wrapper items should not show markers in comment renderer',
	featureFlags: {
		platform_editor_flexible_list_indentation: true,
	},
});
