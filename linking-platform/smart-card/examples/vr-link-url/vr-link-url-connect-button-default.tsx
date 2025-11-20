import React from 'react';

import LinkUrl from '../../src/view/LinkUrl';
import VRTestWrapper from '../utils/vr-test-wrapper';

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<LinkUrl href="https://www.example.com/">Example Link</LinkUrl>
	</VRTestWrapper>
);
