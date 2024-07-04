/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import VRTestWrapper from '../utils/vr-test-wrapper';
import {
	ExpandedFrame,
	type ExpandedFrameProps,
} from '../../src/view/EmbedCard/components/ExpandedFrame';

const wrapperStyles = css({
	padding: token('space.250', '20px'),
});

const VREmbedFrame = (props: Partial<ExpandedFrameProps>) => (
	<VRTestWrapper overrideCss={wrapperStyles}>
		<ExpandedFrame text="frame text" testId="vr-embed-card-frame" {...props}>
			<div></div>
		</ExpandedFrame>
	</VRTestWrapper>
);

export default VREmbedFrame;
