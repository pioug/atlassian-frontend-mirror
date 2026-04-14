import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import { SpotlightTarget } from '@atlaskit/onboarding';
import { fg } from '@atlaskit/platform-feature-flags';
import { PopoverProvider, PopoverTarget } from '@atlaskit/spotlight';

export interface ConditionalSpotlightTargetWrapperProps {
	spotlightTargetName?: string;
	children: React.ReactElement;
}

export const ConditionalSpotlightTargetWrapper = ({
	spotlightTargetName,
	children,
}: ConditionalSpotlightTargetWrapperProps): React.JSX.Element => {
	if (spotlightTargetName) {
		if (fg('navx-4548-migrate-to-atlaskit-spotlight')) {
			return (
				<PopoverProvider>
					<PopoverTarget>{children}</PopoverTarget>
				</PopoverProvider>
			);
		}
		return <SpotlightTarget name={spotlightTargetName}>{children}</SpotlightTarget>;
	}
	return children;
};
