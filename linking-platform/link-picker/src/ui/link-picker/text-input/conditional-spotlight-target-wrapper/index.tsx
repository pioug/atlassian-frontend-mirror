import React from 'react';

import { SpotlightTarget } from '@atlaskit/onboarding';

export interface ConditionalSpotlightTargetWrapperProps {
	spotlightTargetName?: string;
	children: React.ReactElement;
}

export const ConditionalSpotlightTargetWrapper = ({
	spotlightTargetName,
	children,
}: ConditionalSpotlightTargetWrapperProps) => {
	return spotlightTargetName ? (
		<SpotlightTarget name={spotlightTargetName}>{children}</SpotlightTarget>
	) : (
		children
	);
};
