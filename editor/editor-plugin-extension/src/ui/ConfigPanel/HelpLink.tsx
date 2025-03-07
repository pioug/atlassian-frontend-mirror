import React from 'react';

type HelpLinkProps = {
	documentationUrl: string;
	label: string;
};

export const HelpLink = ({ documentationUrl, label }: HelpLinkProps) => {
	return (
		// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
		<a
			target="_blank"
			rel="noopener noreferrer"
			href={documentationUrl}
			data-testid="config-panel-header-documentation-link"
		>
			{label}
		</a>
	);
};
