import React from 'react';

import { Text } from '@atlaskit/primitives/compiled';
import {
	SpotlightActions,
	SpotlightBody,
	SpotlightCard,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightPrimaryLink,
	SpotlightSecondaryLink,
} from '@atlaskit/spotlight';

export default (): JSX.Element => (
	<SpotlightCard>
		<SpotlightHeader>
			<SpotlightHeadline>Try the new experience</SpotlightHeadline>
			<SpotlightControls>
				<SpotlightDismissControl />
			</SpotlightControls>
		</SpotlightHeader>
		<SpotlightBody>
			<Text>
				When your primary or secondary control should navigate to a URL instead of performing an
				action, use SpotlightPrimaryLink and SpotlightSecondaryLink.
			</Text>
		</SpotlightBody>
		<SpotlightFooter>
			<SpotlightActions>
				<SpotlightSecondaryLink
					href="https://atlassian.design/components/spotlight"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn more
				</SpotlightSecondaryLink>
				<SpotlightPrimaryLink
					href="https://atlassian.design"
					target="_blank"
					rel="noopener noreferrer"
				>
					Get started
				</SpotlightPrimaryLink>
			</SpotlightActions>
		</SpotlightFooter>
	</SpotlightCard>
);
