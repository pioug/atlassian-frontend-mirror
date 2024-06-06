/** @jsx jsx */
import { jsx } from '@emotion/react';
import { VRTestWrapper } from './utils/vr-test';
import LinkUrl from '../src/view/LinkUrl';

export default () => (
	<VRTestWrapper title="Link Safety Warning message">
		<LinkUrl href="www.youtube.com">atlassian.com/smart-cards</LinkUrl>
	</VRTestWrapper>
);
