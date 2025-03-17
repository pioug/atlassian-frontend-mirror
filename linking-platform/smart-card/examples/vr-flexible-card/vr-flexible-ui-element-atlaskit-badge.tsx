/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { StoryPoints } from '../../src/view/FlexibleCard/components/elements';
import { getContext } from '../utils/flexible-ui';
import { HorizontalWrapper } from '../utils/vr-test';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({
	storyPoints: 3,
});

const overrideCss = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> span': {
		backgroundColor: token('color.background.accent.blue.subtle', '#579DFF'),
	},
});

export default () => {
	return (
		<VRTestWrapper>
			<FlexibleUiContext.Provider value={context}>
				<h5>Default View</h5>
				<HorizontalWrapper>
					<StoryPoints testId="vr-test-badge-storyPoint" />
				</HorizontalWrapper>
				<h5>Override CSS</h5>
				<HorizontalWrapper>
					<StoryPoints css={overrideCss} />
				</HorizontalWrapper>
			</FlexibleUiContext.Provider>
		</VRTestWrapper>
	);
};
