import React from 'react';

import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';

import { CONTENT_URL_AI } from '../../../../../constants';

const AILearnMoreAnchor = ({
	children,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
	fg('platform-linking-fix-a11y-in-smart-card') ? (
		<Link href={CONTENT_URL_AI} target="_blank" rel="noopener noreferrer" {...props}>
			{children}
		</Link>
	) : (
		// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
		<a href={CONTENT_URL_AI} target="_blank" rel="noopener noreferrer" {...props}>
			{children}
		</a>
	);

export default AILearnMoreAnchor;
