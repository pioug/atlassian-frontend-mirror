import React, { useState } from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import SearchIcon from '@atlaskit/icon/core/search';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const SpotlightActionsAppearance = (): React.JSX.Element => {
	const [isSpotlightActive, setIsSpotlightActive] = useState(false);
	const start = () => setIsSpotlightActive(true);
	const end = () => setIsSpotlightActive(false);
	return (
		<SpotlightManager>
			<SpotlightTarget name="action-button-appearances">
				<IconButton icon={SearchIcon} label="Example" />
			</SpotlightTarget>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: token('space.200') }}>
				<Button appearance="primary" onClick={() => start()}>
					Show example spotlight
				</Button>
			</div>
			<SpotlightTransition>
				{isSpotlightActive && (
					<Spotlight
						actions={[
							{ onClick: () => end(), text: 'Default' },
							{
								appearance: 'subtle',
								onClick: () => end(),
								text: 'Subtle',
							},
							{
								appearance: 'subtle-link',
								onClick: () => end(),
								text: 'Subtle link',
							},
						]}
						heading="Action button appearances"
						key="action-button-appearances"
						target="action-button-appearances"
						targetRadius={3}
						targetBgColor={N0}
					>
						You can change the default action button appearance to `subtle` or `subtle-link`.
					</Spotlight>
				)}
			</SpotlightTransition>
		</SpotlightManager>
	);
};

export default SpotlightActionsAppearance;
