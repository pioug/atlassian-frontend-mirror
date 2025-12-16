import React from 'react';

import SectionMessage from '@atlaskit/section-message';

export default (): React.JSX.Element => (
	<SectionMessage
		title="New"
		appearance="discovery"
		isDismissible
		onDismiss={() => {
			console.log('dismissed');
		}}
	>
		<p>This is a live doc! You can make updates instantly without having to publish.</p>
	</SectionMessage>
);
