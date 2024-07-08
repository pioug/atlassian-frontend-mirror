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

setBooleanFeatureFlagResolver(() => {
	return false;
});
// Content inside embed card does not extend out of it when `platform.linking-platform.smart-card.fix-embed-card-blurring` is disabled.
export default () => (
	<VRCardView
		appearance="embed"
		client={new ForbiddenClient()}
		inheritDimensions={true}
		overrideCss={customCss}
	/>
);
