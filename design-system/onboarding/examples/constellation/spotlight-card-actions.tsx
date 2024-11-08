import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';
import { SpotlightCard } from '@atlaskit/onboarding';

const SpotlightCardActionsExample = () => {
	return (
		<SpotlightCard
			actions={[
				{ text: 'Next', onClick: __noop },
				{ text: 'Dismiss', onClick: __noop, appearance: 'subtle' },
			]}
		>
			Select the project name and icon to quickly switch between your most recent projects.
		</SpotlightCard>
	);
};

export default SpotlightCardActionsExample;
