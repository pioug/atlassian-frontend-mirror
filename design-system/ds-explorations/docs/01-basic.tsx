import React from 'react';

import { AtlassianInternalWarning, DevPreviewWarning, md } from '@atlaskit/docs';
import { token } from '@atlaskit/tokens';

export default md`
${(
	<>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ marginBottom: token('space.100', '8px') }}>
			<AtlassianInternalWarning />
		</div>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={{ marginTop: token('space.100', '8px') }}>
			<DevPreviewWarning />
		</div>
	</>
)}`;
