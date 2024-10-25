/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { StoryPoints } from '../../src/view/FlexibleCard/components/elements';
import { exampleTokens, getContext } from '../utils/flexible-ui';
import { HorizontalWrapper } from '../utils/vr-test';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({
	storyPoints: 3,
});

const overrideCss = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		backgroundColor: exampleTokens.overrideColor,
	},
});

export default () => (
	<VRTestWrapper>
		<FlexibleUiContext.Provider value={context}>
			<h5>Default View</h5>
			<HorizontalWrapper>
				<StoryPoints testId="vr-test-badge-storyPoint" />
			</HorizontalWrapper>
			<h5>Override CSS</h5>
			<HorizontalWrapper>
				<StoryPoints overrideCss={overrideCss} />
			</HorizontalWrapper>
		</FlexibleUiContext.Provider>
	</VRTestWrapper>
);
