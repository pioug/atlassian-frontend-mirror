import React from 'react';

import { token } from '@atlaskit/tokens';

import {
	ExpandedFrame,
	type ExpandedFrameProps,
} from '../../src/view/EmbedCard/components/ExpandedFrame';
import VRTestWrapper from '../utils/vr-test-wrapper';

const VREmbedFrame = (props: Partial<ExpandedFrameProps>) => (
	<VRTestWrapper
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			padding: token('space.250', '20px'),
		}}
	>
		<ExpandedFrame text="frame text" testId="vr-embed-card-frame" {...props}>
			<div></div>
		</ExpandedFrame>
	</VRTestWrapper>
);

export default VREmbedFrame;
