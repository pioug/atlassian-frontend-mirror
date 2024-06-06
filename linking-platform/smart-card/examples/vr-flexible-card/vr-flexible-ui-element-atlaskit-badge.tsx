/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { HorizontalWrapper } from '../utils/vr-test';
import VRTestWrapper from '../utils/vr-test-wrapper';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { exampleTokens, getContext } from '../utils/flexible-ui';
import { StoryPoints } from '../../src/view/FlexibleCard/components/elements';

const context = getContext({
	storyPoints: 3,
});

const overrideCss = css({
	'> span': {
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
