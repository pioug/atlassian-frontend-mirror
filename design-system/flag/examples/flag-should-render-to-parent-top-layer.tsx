import React from 'react';

import Flag, { FlagGroup } from '@atlaskit/flag';
import InfoIcon from '@atlaskit/icon/core/status-information';
import { token } from '@atlaskit/tokens';

/**
 * Minimal example for Playwright: `shouldRenderToParent` is a no-op on the top-layer path
 * (flags still render inside `popover="manual"`; no portal).
 */
export default function FlagShouldRenderToParentTopLayerExample(): React.JSX.Element {
	return (
		<FlagGroup shouldRenderToParent>
			<Flag
				id="flag-srp-1"
				icon={<InfoIcon color={token('color.icon.information')} label="Info" />}
				title="Flag with shouldRenderToParent"
				testId="flag-srp-1"
			/>
		</FlagGroup>
	);
}
