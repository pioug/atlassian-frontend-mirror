import React from 'react';
import { token } from '@atlaskit/tokens';

const Seperator = () => {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				height: '80%',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginLeft: token('space.050', '4px'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginRight: token('space.050', '4px'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginTop: 'auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				marginBottom: 'auto',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				width: 1,
				borderLeft: `1px solid gray`,
			}}
		></div>
	);
};

export default Seperator;
