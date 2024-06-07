import React from 'react';
import { CONTENT_URL_AI } from '../../../../../constants';

const AILearnMoreAnchor: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
	children,
	...props
}) => (
	<a href={CONTENT_URL_AI} target="_blank" rel="noopener noreferrer" {...props}>
		{children}
	</a>
);

export default AILearnMoreAnchor;
