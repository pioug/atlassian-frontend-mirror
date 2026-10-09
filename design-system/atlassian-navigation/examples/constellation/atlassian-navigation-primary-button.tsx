import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { PrimaryButton } from '@atlaskit/atlassian-navigation/primary-button';

const PrimaryButtonExample = (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		primaryItems={[
			<PrimaryButton>Explore</PrimaryButton>,
			<PrimaryButton>Work items</PrimaryButton>,
			<PrimaryButton>Services</PrimaryButton>,
		]}
	/>
);

export default PrimaryButtonExample;
