/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { ResolvedClient, withWaitForItem } from '@atlaskit/link-test-helpers';
import { iconTestUrls } from '@atlaskit/link-test-helpers/smart-card';

import VRCardView from '../utils/vr-card-view';
import '../utils/vr-preload-link-type-icons';

const resolvedBlockTitleCount = iconTestUrls.length;

const blockIconVariationsWidth = css({
	width: '560px',
});

const BlockCardResolvedIconVariationsInner = (): React.JSX.Element => (
	<div css={blockIconVariationsWidth}>
		<VRCardView
			appearance="block"
			client={new ResolvedClient()}
			urls={iconTestUrls}
			stackUrlListVertically
		/>
	</div>
);

/**
 * Visual regression: all ResolvedClient icon-test URLs as block cards
 * (flexible link icon path + same mocks as iconTestUrls).
 */
const _default_1: React.ComponentType<object> = withWaitForItem(BlockCardResolvedIconVariationsInner, () => {
    const items = document.body.querySelectorAll('[data-testid="smart-block-title-resolved-view"]');
    const last = items[resolvedBlockTitleCount - 1];
    if (!last && items.length) {
        items[items.length - 1].scrollIntoView();
    }
    return last;
});
export default _default_1;
