import React from 'react';

import Flag from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { token } from '@atlaskit/tokens';

const FlagActionsExample = () => {
	return (
		<Flag
			icon={<SuccessIcon color={token('color.icon.success')} label="" />}
			id="1"
			key="1"
			title="Task START-42 was created successfully"
			actions={[
				{
					content: 'View task',
					onClick: () => {
						console.log('flag action clicked');
					},
				},
				{
					content: 'Add to next sprint',
					href: '/components/flag/examples#actions',
				},
			]}
		/>
	);
};

export default FlagActionsExample;
