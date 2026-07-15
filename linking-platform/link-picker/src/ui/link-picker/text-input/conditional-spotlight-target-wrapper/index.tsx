import React from 'react';

import { PopoverProvider } from '@atlaskit/spotlight/popover-provider';
import { PopoverTarget } from '@atlaskit/spotlight/popover-target';

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
