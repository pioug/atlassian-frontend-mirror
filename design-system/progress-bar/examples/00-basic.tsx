import React from 'react';

import { token } from '@atlaskit/tokens';

import ProgressBar from '../src';

export const progress = 0.4;
export const containerStyle: React.CSSProperties = {
	boxSizing: 'border-box',
	padding: token('space.250', '20px'),
	width: 600,
};

export default () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={containerStyle}>
		<ProgressBar value={progress} ariaLabel="Done: 4 of 10 issues" />
	</div>
);
