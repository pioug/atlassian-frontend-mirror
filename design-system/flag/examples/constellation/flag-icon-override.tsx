import React from 'react';

import Flag from '@atlaskit/flag';
import InformationIcon from '@atlaskit/icon/core/status-information';
import { token } from '@atlaskit/tokens';

const FlagDefaultExample = () => {
	return (
		<Flag
			title="New version published"
			description="Scott Farquhar published a new version of this page. Refresh to see the changes."
			icon={<InformationIcon color={token('color.icon.information')} label="Info" />}
			id="new-version"
		/>
	);
};

export default FlagDefaultExample;
