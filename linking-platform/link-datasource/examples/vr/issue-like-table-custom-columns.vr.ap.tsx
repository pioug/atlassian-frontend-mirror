import React from 'react';

import { VRIssueLikeTable } from './issue-like-table.vr.ap';

export default (): React.JSX.Element => {
	return <VRIssueLikeTable visibleColumnKeys={['type', 'key', 'priority', 'summary']} />;
};
