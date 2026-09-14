import React from 'react';

import SectionMessage from '@atlaskit/section-message/message';
import SectionMessageAction from '@atlaskit/section-message/message-action';

export default (): React.JSX.Element => (
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
