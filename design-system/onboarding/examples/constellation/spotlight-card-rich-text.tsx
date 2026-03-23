import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import { SpotlightCard } from '@atlaskit/onboarding';

const SpotlightCardRichTextExample = (): React.JSX.Element => {
	return (
		<SpotlightCard>
			<div>
				All your <strong>projects</strong> and <strong>tasks</strong>, including the ones you've
				just created can be found in the sidebar.
			</div>
		</SpotlightCard>
	);
};

export default SpotlightCardRichTextExample;
