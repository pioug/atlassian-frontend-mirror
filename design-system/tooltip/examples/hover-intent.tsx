import React, { useState } from 'react';

import { token } from '@atlaskit/tokens';
import Tooltip, { type PositionType } from '@atlaskit/tooltip';

import { Target } from './styled';

const colors = ['teal', 'blue', 'purple'];

const HoverIntent = () => {
	const [position, setPosition] = useState<PositionType>('bottom');

	return (
		<React.Fragment>
			<p>
				Click a target to toggle the position of the tooltips between {`'bottom'`} and {`'mouse'`}.
			</p>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ display: 'flex', marginTop: token('space.150', '12px') }}>
				{colors.map((c, i) => (
					<Tooltip key={c} content={`Content ${i + 1}`} position={position}>
						{({ onClick, ...tooltipProps }) => (
							<Target
								onClick={() => setPosition(position === 'bottom' ? 'mouse' : 'bottom')}
								color={c}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
								style={{ marginRight: token('space.100', '8px') }}
								tabIndex={0}
								{...tooltipProps}
							>
								Target {i + 1}
							</Target>
						)}
					</Tooltip>
				))}
			</div>
		</React.Fragment>
	);
};

export default HoverIntent;
