import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';
import { SpotlightCard } from '@atlaskit/onboarding';

import spotlightImage from '../assets/this-is-new-jira.png';

const SpotlightCardHeadingExample = (): React.JSX.Element => {
	return (
		<SpotlightCard
			image={<img src={spotlightImage} alt="" width="400" />}
			heading="Switch it up"
			headingLevel={2}
			actions={[
				{ text: 'Next', onClick: __noop },
				{ text: 'Dismiss', onClick: __noop, appearance: 'subtle' },
			]}
		>
			Select the project name and icon to quickly switch between your most recent projects.
		</SpotlightCard>
	);
};

export default SpotlightCardHeadingExample;
