import React from 'react';

import { GoBackItem, Section } from '@atlaskit/side-navigation';

const ButtonItemExample = (): React.JSX.Element => {
	return (
		<div>
			<Section>
				<GoBackItem description="My project name">Back to project</GoBackItem>
			</Section>
		</div>
	);
};

export default ButtonItemExample;
