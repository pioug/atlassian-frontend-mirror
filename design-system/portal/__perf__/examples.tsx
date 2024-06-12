import React from 'react';

import { token } from '@atlaskit/tokens';

import Portal from '../src';

const PortalPerformance = () => {
	return (
		<Portal zIndex={200}>
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'absolute',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					top: token('space.300', '24px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					left: token('space.300', '24px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					background: 'lightpink',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: token('space.300', '24px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderRadius: '3px',
					// this z-index is relative to the portal
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					zIndex: 1,
				}}
			>
				<p>portal z-index: 200</p>
				<p>element z-index: 1</p>
			</div>
		</Portal>
	);
};

export default PortalPerformance;
