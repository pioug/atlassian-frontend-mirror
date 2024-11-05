import React, { useState } from 'react';

import { Presence } from '@atlaskit/avatar';

const AvatarPresenceWidthExample = () => {
	const [width, setWidth] = useState(60);

	return (
		<div>
			<input
				min="10"
				max="130"
				onChange={(e) => setWidth(parseInt(e.target.value, 10))}
				step="10"
				title="Width"
				type="range"
				value={width}
			/>
			{/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ maxWidth: width, border: '1px dotted blue' }}>
				<Presence presence="busy" />
			</div>
		</div>
	);
};

export default AvatarPresenceWidthExample;
