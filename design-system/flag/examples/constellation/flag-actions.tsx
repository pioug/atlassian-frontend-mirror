import React from 'react';

import Flag from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { token } from '@atlaskit/tokens';

const FlagActionsExample = () => {
	return (
		<Flag
			icon={<SuccessIcon primaryColor={token('color.icon.success')} label="Success" />}
			id="1"
			key="1"
			title="Issue START-42 was created successfully"
			actions={[
				{
					content: 'View issue',
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
