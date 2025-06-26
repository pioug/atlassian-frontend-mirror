import React from 'react';

import { ForbiddenClient } from '@atlaskit/link-test-helpers';

import VRCardView from '../utils/vr-card-view';

// Content inside embed card should not extend out of it,
// (it also gates the fix to the overflow styles)
export default () => (
	<VRCardView
		appearance="embed"
		client={new ForbiddenClient()}
		inheritDimensions={true}
		style={{
			/**
			 * A container that forces the embed to be smaller than the content
			 * to test whether the content inside the embed card is clipped.
			 */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			width: '300px',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			height: '200px',
		}}
	/>
);
