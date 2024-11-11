import React from 'react';

import InlineMessage from '@atlaskit/inline-message';
import Link from '@atlaskit/link';

const InlineMessageConfirmation = () => {
	return (
		<InlineMessage appearance="confirmation" secondaryText="Files have been added">
			<p>You have successfully uploaded 3 files.</p>
			<p>
				<Link href="atlassian.design">View files</Link>
			</p>
		</InlineMessage>
	);
};

export default InlineMessageConfirmation;
