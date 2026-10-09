import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import Spotlight from '@atlaskit/onboarding/spotlight';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import SpotlightManager from '@atlaskit/onboarding/spotlight-manager';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import SpotlightTarget from '@atlaskit/onboarding/spotlight-target';
// eslint-disable-next-line @atlaskit/design-system/use-spotlight-package
import SpotlightTransition from '@atlaskit/onboarding/spotlight-transition';
import { token } from '@atlaskit/tokens';

import spotlightImage from '../assets/this-is-new-jira.png';

const SpotlightImageExample = (): React.JSX.Element => {
	const [isSpotlightActive, setIsSpotlightActive] = useState(false);
	const start = () => setIsSpotlightActive(true);
	const end = () => setIsSpotlightActive(false);
	return (
		<SpotlightManager>
			<SpotlightTarget name="switch">
				<Button>Switch projects</Button>
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
						image={spotlightImage}
						actions={[
							{
								onClick: () => end(),
								text: 'OK',
							},
						]}
						target="switch"
						label="Switch projects"
						key="switch"
						targetRadius={3}
						targetBgColor={'#FFFFFF'}
					>
						Select the project name and icon to quickly switch between your most recent projects.
					</Spotlight>
				)}
			</SpotlightTransition>
		</SpotlightManager>
	);
};

export default SpotlightImageExample;
