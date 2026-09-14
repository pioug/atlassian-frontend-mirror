import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { GoBackItem } from '@atlaskit/side-navigation/go-back-item';
import { Section } from '@atlaskit/side-navigation/section';

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
