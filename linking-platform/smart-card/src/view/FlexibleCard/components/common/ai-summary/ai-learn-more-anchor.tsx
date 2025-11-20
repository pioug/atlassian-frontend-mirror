import React from 'react';

import Link from '@atlaskit/link';

import { CONTENT_URL_AI } from '../../../../../constants';

const AILearnMoreAnchor = ({
	children,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>): React.JSX.Element => (
	<Link href={CONTENT_URL_AI} target="_blank" rel="noopener noreferrer" {...props}>
		{children}
	</Link>
);

export default AILearnMoreAnchor;
