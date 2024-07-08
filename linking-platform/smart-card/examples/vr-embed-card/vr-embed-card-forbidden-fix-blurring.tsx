import React from 'react';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

// Note: overrideCss requires SerialisedStyles which compiled doesn't appear to support.
// Refactor ticket: https://product-fabric.atlassian.net/browse/EDM-10366

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { ForbiddenClient } from '../utils/custom-client';
import VRCardView from '../utils/vr-card-view';

/**
 * A container that forces the embed to be smaller than the content
 * to test whether the content inside the embed card is clipped.
 */
const customCss = css({
	width: '300px',
	height: '200px',
});

setBooleanFeatureFlagResolver((flagKey) => {
	if (flagKey === 'platform.linking-platform.smart-card.fix-embed-card-blurring') {
		return true;
	}
	return false;
});
// Content inside embed card should not extend out of it,
// even when `platform.linking-platform.smart-card.fix-embed-card-blurring` is enabled
// (it also gates the fix to the overflow styles)
export default () => (
	<VRCardView
		appearance="embed"
		client={new ForbiddenClient()}
		inheritDimensions={true}
		overrideCss={customCss}
	/>
);
