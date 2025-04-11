import React from 'react';

import { VRIssueLikeTable } from '../../examples/vr/issue-like-table';

export default () => {
	return <VRIssueLikeTable forceLoading={true} mockExecutionDelay={Infinity} />;
};
