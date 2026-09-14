import React from 'react';

import Link from '@atlaskit/link/link';

type HelpLinkProps = {
	documentationUrl: string;
	label: string;
};

export const HelpLink = ({ documentationUrl, label }: HelpLinkProps): React.JSX.Element => {
	return (
		<Link
			target="_blank"
			rel="noopener noreferrer"
			href={documentationUrl}
			testId="config-panel-header-documentation-link"
		>
			{label}
		</Link>
	);
};
