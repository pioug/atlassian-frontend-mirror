import React from 'react';

import UFOSegment, { type Props as SegmentProps } from './segment';

export const UFOThirdPartySegment: {
	(props: Omit<SegmentProps, 'type'>): React.JSX.Element;
	displayName: string;
} = (props: Omit<SegmentProps, 'type'>): React.JSX.Element => {
	const { children, ...otherProps } = props;
	return (
		<UFOSegment type="third-party" {...otherProps}>
			{children}
		</UFOSegment>
	);
};

UFOThirdPartySegment.displayName = 'UFOThirdPartySegment';
