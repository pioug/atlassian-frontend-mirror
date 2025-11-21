import React from 'react';

import { SuccessProgressBar } from '@atlaskit/progress-bar';

import { containerStyle } from './00-basic';

export default (): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	<div style={containerStyle}>
		<SuccessProgressBar value={1} ariaLabel="Done: 10 of 10 work items" />
	</div>
);
