import React from 'react';

import { VRIssueLikeTable } from '../../examples/vr/issue-like-table';

export default () => {
	return <VRIssueLikeTable visibleColumnKeys={['type', 'key', 'priority', 'summary']} />;
};
