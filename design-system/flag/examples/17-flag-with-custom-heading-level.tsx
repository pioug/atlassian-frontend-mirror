import React from 'react';

import Flag from '@atlaskit/flag';
import InfoIcon from '@atlaskit/icon/glyph/info';
import { token } from '@atlaskit/tokens';

export default (): React.JSX.Element => (
	<>
		<h2>Flag with custom heading level</h2>
		<Flag
			icon={<InfoIcon primaryColor={token('color.icon.information')} label="Info" />}
			description="Scott Farquhar published a new version of this page. Refresh to see the changes."
			id="1"
			title="New version published"
			headingLevel={3}
		/>
	</>
);
