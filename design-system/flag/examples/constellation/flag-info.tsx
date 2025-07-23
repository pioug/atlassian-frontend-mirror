import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Flag from '@atlaskit/flag';
import InformationIcon from '@atlaskit/icon/core/migration/status-information--info';
import { token } from '@atlaskit/tokens';

const FlagInfoExample = () => {
	return (
		<Flag
			appearance="info"
			icon={
				<InformationIcon
					label="Info"
					LEGACY_secondaryColor={token('color.background.neutral.bold')}
					color={token('color.icon.inverse')}
					spacing="spacious"
				/>
			}
			id="info"
			key="info"
			title="There’s no one in this project"
			description="Add yourself or your team to get the party started."
			actions={[
				{ content: 'Add teammates', onClick: noop },
				{ content: 'Close', onClick: noop },
			]}
		/>
	);
};

export default FlagInfoExample;
