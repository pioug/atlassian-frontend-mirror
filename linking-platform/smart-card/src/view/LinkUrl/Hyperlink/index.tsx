import React from 'react';

import AKLink, { type LinkProps } from '@atlaskit/link';

import { withLinkClickedEvent } from '../../../utils/analytics/click';
import { type LinkUrlProps } from '../types';

const Anchor = withLinkClickedEvent('a');
export const LinkComponent: {
    (props: LinkProps): React.ReactElement<LinkProps, string | React.JSXElementConstructor<any>>;
    displayName: string;
} = withLinkClickedEvent(AKLink);

const Hyperlink = ({
	href,
	children,
	testId,
	isLinkComponent = false,
	...props
}: LinkUrlProps): React.JSX.Element => {
	const Link = isLinkComponent ? LinkComponent : Anchor;
	return (
		<Link
			{...(isLinkComponent ? { testId } : { 'data-testid': testId })}
			href={href || ''}
			{...props}
		>
			{children}
		</Link>
	);
};

export default Hyperlink;
