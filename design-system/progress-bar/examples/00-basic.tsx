import React from 'react';

import ProgressBar from '@atlaskit/progress-bar';
import { token } from '@atlaskit/tokens';

export const progress = 0.4;
export const containerStyle: React.CSSProperties = {
	boxSizing: 'border-box',
	padding: token('space.250', '20px'),
	width: 600,
};

export default (): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={containerStyle}>
		<ProgressBar value={progress} testId="progress-bar" ariaLabel="Done: 4 of 10 work items" />
	</div>
);
