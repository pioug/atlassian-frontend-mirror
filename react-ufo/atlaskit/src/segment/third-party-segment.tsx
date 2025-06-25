import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import UFOIgnoreHolds from '../ignore-holds';

import UFOSegment, { Props as SegmentProps } from './segment';

export function UFOThirdPartySegment(props: Omit<SegmentProps, 'type'>) {
	const { children, ...otherProps } = props;
	return (
		<UFOSegment type="third-party" {...otherProps}>
			<UFOIgnoreHolds
				ignore={fg('platform_ufo_exclude_3p_elements_from_ttai')}
				reason="third-party-element"
			>
				{children}
			</UFOIgnoreHolds>
		</UFOSegment>
	);
}

UFOThirdPartySegment.displayName = 'UFOThirdPartySegment';
