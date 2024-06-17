/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { VRTestWrapper } from './utils/vr-test';
import LinkUrl from '../src/view/LinkUrl';

export default () => (
	<VRTestWrapper title="Link Safety Warning message">
		<LinkUrl href="www.youtube.com">atlassian.com/smart-cards</LinkUrl>
	</VRTestWrapper>
);
