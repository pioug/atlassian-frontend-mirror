import React from 'react';

import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

export default (): React.JSX.Element => (
	<SectionMessage
		title="Merged pull request"
		appearance="success"
		actions={[
			<SectionMessageAction href="#">View commit</SectionMessageAction>,
			<SectionMessageAction onClick={() => {}}>Dismiss</SectionMessageAction>,
		]}
	>
		<p>Pull request #10146 merged after a successful build</p>
	</SectionMessage>
);
