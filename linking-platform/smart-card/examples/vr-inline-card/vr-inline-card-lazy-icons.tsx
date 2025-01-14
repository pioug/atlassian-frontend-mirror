import React from 'react';

import { VRTestCase } from '../utils/common';
import { InlineCardLazyIcons } from '../utils/inline-card-lazy-icons';
import { withWaitForItem } from '../utils/with-wait-for-item';

const VRInlineCardLazyIcons = () => {
	return (
		<VRTestCase title="Inline card with default icon">{() => <InlineCardLazyIcons />}</VRTestCase>
	);
};

VRInlineCardLazyIcons.displayName = 'VRInlineCardLazyIcons';

export default withWaitForItem(InlineCardLazyIcons, () => {
	const item = document.body.querySelectorAll('[data-testid="document-file-format-icon"]');
	return item[20];
});
