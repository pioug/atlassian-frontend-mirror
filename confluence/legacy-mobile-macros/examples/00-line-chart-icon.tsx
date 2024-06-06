import React from 'react';

import { token } from '@atlaskit/tokens';

import { LineChartIcon } from '../src/common/ui';

export default function LineChartIconExample() {
	return (
		<div style={{ padding: `${token('space.600', '48px')}` }}>
			<LineChartIcon />
		</div>
	);
}
