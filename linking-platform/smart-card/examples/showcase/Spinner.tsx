import React from 'react';

import Spinner from '@atlaskit/spinner';

export const exampleSpinner = (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={{ height: '100%', width: '100%', position: 'relative' }}>
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'flex',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				justifyContent: 'center',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: '100%',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				alignItems: 'center',
			}}
		>
			<Spinner size="large" />
		</div>
	</div>
);
