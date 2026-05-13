import React from 'react';

import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';

import { CONTENT_URL_AI, CONTENT_URL_ROVO } from '../../../../../constants';

const AILearnMoreAnchor = ({
	children,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>): React.JSX.Element => (
	<Link
		href={fg('platform_sl_ai_summary_rebrand') ? CONTENT_URL_ROVO : CONTENT_URL_AI}
		target="_blank"
		rel="noopener noreferrer"
		{...props}
	>
		{children}
	</Link>
);

export default AILearnMoreAnchor;
