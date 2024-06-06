import React from 'react';

import { VRTestWrapper } from './utils/vr-test';
import UnresolvedViewTest from './utils/vr-block-flexible-views';

export default () => (
	<VRTestWrapper title="Inline card unresolved views">
		<UnresolvedViewTest appearance="inline" />
	</VRTestWrapper>
);
