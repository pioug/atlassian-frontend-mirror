import React from 'react';

import { TransparentProgressBar } from '@atlaskit/progress-bar';
import { token } from '@atlaskit/tokens';

import { progress } from './00-basic';

const containerStyle = {
	padding: '25px 10px',
	background: token('color.background.brand.bold'),
	borderRadius: 3,
};

export default () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={containerStyle}>
		<TransparentProgressBar value={progress} ariaLabel="Done: 4 of 10 issues" />
	</div>
);
