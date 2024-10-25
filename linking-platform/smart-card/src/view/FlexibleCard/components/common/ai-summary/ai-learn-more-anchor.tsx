import React from 'react';

import { CONTENT_URL_AI } from '../../../../../constants';

const AILearnMoreAnchor = ({
	children,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
	<a href={CONTENT_URL_AI} target="_blank" rel="noopener noreferrer" {...props}>
		{children}
	</a>
);

export default AILearnMoreAnchor;
