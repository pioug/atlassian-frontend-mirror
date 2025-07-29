import React from 'react';

import Flag from '@atlaskit/flag';
import InformationIcon from '@atlaskit/icon/core/migration/status-information--info';
import { token } from '@atlaskit/tokens';

const FlagDefaultExample = () => {
	return (
		<Flag
			title="New version published"
			description="Scott Farquhar published a new version of this page. Refresh to see the changes."
			icon={
				<InformationIcon
					LEGACY_primaryColor={token('color.icon.information')}
					color={token('color.icon.information')}
					label="Info"
				/>
			}
			id="new-version"
		/>
	);
};

export default FlagDefaultExample;
