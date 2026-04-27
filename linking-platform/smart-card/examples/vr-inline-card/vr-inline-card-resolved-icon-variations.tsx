import React from 'react';

import { ResolvedClient, withWaitForItem } from '@atlaskit/link-test-helpers';
import { iconTestUrls } from '@atlaskit/link-test-helpers/smart-card';

import VRCardView from '../utils/vr-card-view';

const resolvedInlineCardCount = iconTestUrls.length;

const InlineCardResolvedIconVariationsInner = (): React.JSX.Element => (
	<VRCardView
		appearance="inline"
		client={new ResolvedClient()}
		urls={iconTestUrls}
		stackUrlListVertically
	/>
);

/**
 * Visual regression: all ResolvedClient icon-test URLs in a single inline column
 * (same JSON-LD set as examples 11-inline-card-views / CardViewExample [Resolved]).
 */
const _default_1: React.ComponentType<object> = withWaitForItem(InlineCardResolvedIconVariationsInner, () => {
    const items = document.body.querySelectorAll('[data-testid="inline-card-resolved-view"]');
    return items[resolvedInlineCardCount - 1];
});
export default _default_1;
