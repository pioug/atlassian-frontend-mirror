import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import UFOIgnoreHolds from '../ignore-holds';

import UFOSegment, { type Props as SegmentProps } from './segment';

export function UFOThirdPartySegment(props: Omit<SegmentProps, 'type'>): React.JSX.Element {
	const { children, ...otherProps } = props;
	return fg('platform_ufo_enable_ttai_with_3p') ? (
		<UFOSegment type="third-party" {...otherProps}>
			{children}
		</UFOSegment>
	) : (
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
