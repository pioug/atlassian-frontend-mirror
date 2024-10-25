/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { SmartLinkSize } from '../../src/constants';
import FlexibleCard from '../../src/view/FlexibleCard';
import { TitleBlock } from '../../src/view/FlexibleCard/components/blocks';
import { exampleTokens, getCardState } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const clickableContainerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.layered-link': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: exampleTokens.iconBackgroundColor,
		opacity: 0.2,
	},
});

const cardState = getCardState();
const render = (
	hideBackground = false,
	hideElevation = false,
	hidePadding = false,
	size = SmartLinkSize.Medium,
	clickableContainer = false,
) => (
	<FlexibleCard
		cardState={cardState}
		ui={{
			clickableContainer,
			hideBackground,
			hideElevation,
			hidePadding,
			size,
		}}
		url="link-url"
	>
		<TitleBlock />
	</FlexibleCard>
);
export default () => (
	<VRTestWrapper>
		<SmartCardProvider>
			<h5>Hide background</h5>
			{render(true, false, false)}
			<h5>Hide elevation</h5>
			{render(false, true, false)}
			<h5>Hide padding</h5>
			{render(false, false, true)}
			{Object.values(SmartLinkSize).map((size, idx) => (
				<React.Fragment key={idx}>
					<h5>Size: {size}</h5>
					{render(false, false, false, size)}
				</React.Fragment>
			))}
			<h5>Clickable container</h5>
			<div css={clickableContainerStyles}>{render(false, false, false, undefined, true)}</div>
		</SmartCardProvider>
	</VRTestWrapper>
);
