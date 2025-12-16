import React from 'react';

import SectionMessage from '@atlaskit/section-message';

export default (): React.JSX.Element => (
	<SectionMessage title="This account has been permanently deleted" appearance="error">
		<p>The user `IanAtlas` no longer has access to Atlassian services.</p>
	</SectionMessage>
);
