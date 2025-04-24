import { withWaitForItem } from '@atlaskit/link-test-helpers';

import { InlineCardIcons } from '../utils/inline-card-icons';

export default withWaitForItem(InlineCardIcons, () => {
	const item = document.body.querySelectorAll('[data-testid="document-file-format-icon"]');
	return item[20];
});
