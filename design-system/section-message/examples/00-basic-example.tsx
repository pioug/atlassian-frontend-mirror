import React from 'react';

import { Text } from '@atlaskit/primitives';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

const Example = () => (
	<SectionMessage
		title="Editing is restricted"
		testId="section-message"
		actions={[
			<SectionMessageAction href="https://https://atlassian.design/">
				Request edit access
			</SectionMessageAction>,
			<SectionMessageAction href="https://confluence.atlassian.com/jirasoftwareserver/permissions-overview-939938996.html">
				About permissions
			</SectionMessageAction>,
		]}
	>
		<Text as="p">
			You're not allowed to change these restrictions. It's either due to the restrictions on the
			page, or permission settings for this space.
		</Text>
	</SectionMessage>
);

export default Example;
