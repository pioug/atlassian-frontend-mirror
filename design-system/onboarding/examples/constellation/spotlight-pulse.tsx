import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import {
	Spotlight,
	SpotlightManager,
	SpotlightPulse,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { N0 } from '@atlaskit/theme/colors';

const SpotlightPulseExample = () => {
	const [isSpotlightActive, setIsSpotlightActive] = useState(false);
	const start = () => setIsSpotlightActive(true);
	const end = () => setIsSpotlightActive(false);
	return (
		<SpotlightManager>
			<ButtonGroup label="Choose spotlight options">
				<SpotlightTarget name="new">
					<SpotlightPulse radius={3} pulse={isSpotlightActive ? false : true}>
						<Button onClick={() => start()}>New feature</Button>
					</SpotlightPulse>
				</SpotlightTarget>
				<SpotlightTarget name="copy">
					<Button>Existing feature</Button>
				</SpotlightTarget>
			</ButtonGroup>

			<SpotlightTransition>
				{isSpotlightActive && (
					<Spotlight
						actions={[
							{
								onClick: () => end(),
								text: 'OK',
							},
						]}
						heading="Spotlight pulse"
						target="new"
						key="new"
						targetRadius={3}
						targetBgColor={N0}
					>
						Announcing new features with a spotlight pulse is an onboarding pattern that you can
						explore.
					</Spotlight>
				)}
			</SpotlightTransition>
		</SpotlightManager>
	);
};

export default SpotlightPulseExample;
