import React from 'react';

import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';

type HelpLinkProps = {
	documentationUrl: string;
	label: string;
};

export const HelpLink = ({ documentationUrl, label }: HelpLinkProps): React.JSX.Element => {
	return fg('dst-a11y__replace-anchor-with-link__editor-core-ex') ? (
		<Link
			target="_blank"
			rel="noopener noreferrer"
			href={documentationUrl}
			data-testid="config-panel-header-documentation-link"
		>
			{label}
		</Link>
	) : (
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
