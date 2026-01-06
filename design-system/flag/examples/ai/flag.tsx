import React from 'react';

import Flag, { FlagGroup } from '@atlaskit/flag';
import InfoIcon from '@atlaskit/icon/core/status-information';

const Examples = (): React.JSX.Element => (
	<>
		<FlagGroup>
			<Flag
				id="flag-1"
				icon={<InfoIcon label="Info" />}
				title="Success"
				description="Your changes have been saved successfully."
				appearance="success"
			/>
		</FlagGroup>
		<FlagGroup>
			<Flag
				id="flag-2"
				icon={<InfoIcon label="Warning" />}
				title="Warning"
				description="This action cannot be undone."
				appearance="warning"
				actions={[
					{
						content: 'Proceed',
						onClick: () => console.log('Proceed clicked'),
					},
				]}
			/>
		</FlagGroup>
		<FlagGroup>
			<Flag
				id="flag-3"
				icon={<InfoIcon label="Error" />}
				title="Error"
				description="Something went wrong. Please try again."
				appearance="error"
				actions={[
					{
						content: 'Retry',
						onClick: () => console.log('Retry clicked'),
					},
				]}
			/>
		</FlagGroup>
	</>
);
export default Examples;
