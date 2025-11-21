import React from 'react';

import Button from '@atlaskit/button';
import __noop from '@atlaskit/ds-lib/noop';
import CloseIcon from '@atlaskit/icon/core/cross';
import { SpotlightCard } from '@atlaskit/onboarding';
import { token } from '@atlaskit/tokens';

const SpotlightCardHeadingAfterExample = (): React.JSX.Element => {
	return (
		<SpotlightCard
			headingAfterElement={
				<Button
					iconBefore={<CloseIcon label="Close" color={token('color.icon.inverse')} />}
					appearance="subtle"
				/>
			}
			heading="Switch it up"
			headingLevel={2}
			actions={[{ text: 'Next', onClick: __noop }]}
		>
			Select the project name and icon to quickly switch between your most recent projects.
		</SpotlightCard>
	);
};

export default SpotlightCardHeadingAfterExample;
