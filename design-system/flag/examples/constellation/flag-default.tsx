import React from 'react';

import Flag from '@atlaskit/flag';
import InformationIcon from '@atlaskit/icon/core/migration/information--info';
import { token } from '@atlaskit/tokens';

const FlagDefaultExample = () => {
	return (
		<Flag
			icon={
				<InformationIcon
					LEGACY_primaryColor={token('color.icon.information')}
					color={token('color.icon.information')}
					spacing="spacious"
					label="Info"
				/>
			}
			description="Scott Farquhar published a new version of this page. Refresh to see the changes."
			id="1"
			key="1"
			title="New version published"
		/>
	);
};

export default FlagDefaultExample;
