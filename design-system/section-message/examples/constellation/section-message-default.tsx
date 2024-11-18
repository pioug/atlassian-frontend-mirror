import React from 'react';

import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

export default () => (
	<SectionMessage
		title="Editing is restricted"
		actions={[
			<SectionMessageAction href="#">Request edit access</SectionMessageAction>,
			<SectionMessageAction href="#">About permissions</SectionMessageAction>,
		]}
	>
		<p>
			You're not allowed to change these restrictions. It's either due to the restrictions on the
			page, or permission settings for this space.
		</p>
	</SectionMessage>
);
