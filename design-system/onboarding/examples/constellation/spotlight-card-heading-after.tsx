import React from 'react';

import Button from '@atlaskit/button';
import __noop from '@atlaskit/ds-lib/noop';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { SpotlightCard } from '@atlaskit/onboarding';
import { N0 } from '@atlaskit/theme/colors';

const SpotlightCardHeadingAfterExample = () => {
	return (
		<SpotlightCard
			headingAfterElement={
				<Button iconBefore={<CrossIcon label="Close" primaryColor={N0} />} appearance="subtle" />
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
