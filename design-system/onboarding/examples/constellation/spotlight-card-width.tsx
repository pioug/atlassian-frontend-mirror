import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';
import { SpotlightCard } from '@atlaskit/onboarding';
import { token } from '@atlaskit/tokens';

const SpotlightCardWidth = () => {
	return (
		<div
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				display: 'flex',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				flexDirection: 'column',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				gap: token('space.300', '24px'),
			}}
		>
			<SpotlightCard
				width={200}
				heading="Switch it up"
				headingLevel={2}
				actions={[
					{ text: 'Next', onClick: __noop },
					{ text: 'Dismiss', onClick: __noop, appearance: 'subtle' },
				]}
			>
				Select the project name and icon to quickly switch between your most recent projects.
			</SpotlightCard>
			<SpotlightCard
				width={400}
				heading="Switch it up"
				headingLevel={2}
				actions={[
					{ text: 'Next', onClick: __noop },
					{ text: 'Dismiss', onClick: __noop, appearance: 'subtle' },
				]}
			>
				Select the project name and icon to quickly switch between your most recent projects.
			</SpotlightCard>{' '}
			<SpotlightCard
				width={600}
				heading="Switch it up"
				headingLevel={2}
				actions={[
					{ text: 'Next', onClick: __noop },
					{ text: 'Dismiss', onClick: __noop, appearance: 'subtle' },
				]}
			>
				Select the project name and icon to quickly switch between your most recent projects.
			</SpotlightCard>
		</div>
	);
};

export default SpotlightCardWidth;
