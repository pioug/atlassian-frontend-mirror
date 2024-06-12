import React from 'react';

import ProgressBar from '../src';

import { containerStyle } from './00-basic';

export default () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={containerStyle}>
		<ProgressBar isIndeterminate ariaLabel="Loading issues" />
	</div>
);
