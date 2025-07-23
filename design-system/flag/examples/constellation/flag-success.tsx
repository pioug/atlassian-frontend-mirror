import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Flag from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/core/migration/status-success--check-circle';
import { token } from '@atlaskit/tokens';

const FlagSuccessExample = () => {
	return (
		<Flag
			appearance="success"
			icon={
				<SuccessIcon
					label="Success"
					LEGACY_secondaryColor={token('color.background.success.bold')}
					color={token('color.icon.inverse')}
					spacing="spacious"
				/>
			}
			id="success"
			key="success"
			title="Welcome to the room"
			description="You’re now part of Coffee Club."
			actions={[{ content: 'Join the conversation', onClick: noop }]}
		/>
	);
};

export default FlagSuccessExample;
