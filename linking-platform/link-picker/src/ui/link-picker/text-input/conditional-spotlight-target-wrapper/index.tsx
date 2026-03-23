import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import { SpotlightTarget } from '@atlaskit/onboarding';

export interface ConditionalSpotlightTargetWrapperProps {
	spotlightTargetName?: string;
	children: React.ReactElement;
}

export const ConditionalSpotlightTargetWrapper = ({
	spotlightTargetName,
	children,
}: ConditionalSpotlightTargetWrapperProps): React.JSX.Element => {
	return spotlightTargetName ? (
		<SpotlightTarget name={spotlightTargetName}>{children}</SpotlightTarget>
	) : (
		children
	);
};
