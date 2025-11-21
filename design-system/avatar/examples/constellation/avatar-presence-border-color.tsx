import React from 'react';

import { Presence } from '@atlaskit/avatar';

const AvatarPresenceBorderColor = (): React.JSX.Element => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={{ width: 24 }}>
		<Presence presence="online" borderColor="red" />
	</div>
);

export default AvatarPresenceBorderColor;
