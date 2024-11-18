import React from 'react';

import ProgressBar from '@atlaskit/progress-bar';

import { containerStyle } from './00-basic';

export default () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	<div style={containerStyle}>
		<ProgressBar isIndeterminate ariaLabel="Loading issues" />
	</div>
);
