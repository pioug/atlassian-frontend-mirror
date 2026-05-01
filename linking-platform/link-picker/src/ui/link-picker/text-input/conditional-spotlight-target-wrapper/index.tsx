import React from 'react';

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
		return (
			<PopoverProvider>
				<PopoverTarget>{children}</PopoverTarget>
			</PopoverProvider>
		);
	}
	return children;
};
