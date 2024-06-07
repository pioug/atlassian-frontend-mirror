import React from 'react';

import { B200, B400, N0, N100, N400 } from '@atlaskit/theme/colors';

import { AtlassianLogo } from '../src';

export default () => (
	<div data-testid="color">
		<AtlassianLogo />
		<AtlassianLogo textColor={B400} iconColor={B200} />
		<AtlassianLogo textColor={N400} iconColor={N100} />
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ display: 'inline-block', background: B400 }}>
			<AtlassianLogo textColor={N0} iconColor={N0} />
		</div>
		<AtlassianLogo textColor={B400} iconColor={B200} />
		<AtlassianLogo appearance="brand" />
		<AtlassianLogo appearance="neutral" />
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ display: 'inline-block', background: B400 }}>
			<AtlassianLogo appearance="inverse" />
		</div>
	</div>
);
