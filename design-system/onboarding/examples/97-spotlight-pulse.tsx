/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { SpotlightManager, SpotlightPulse, SpotlightTarget } from '@atlaskit/onboarding';

/**
 * This example shows how to use <SpotlightPulse />. This can be used when you want a pulse keyframe
 * on a target that is not active. Note that the pulse prop here is different to the one in <Spotlight />.
 */
const SpotlightPulseExample = () => {
	return (
		<div data-testid="spotlight-pulse-example">
			<SpotlightManager>
				<ButtonGroup label="Pulse spotlight options">
					<SpotlightTarget name="pulse-true">
						<SpotlightPulse radius={3}>
							<Button>This has a pulsing animation</Button>
						</SpotlightPulse>
					</SpotlightTarget>
					<SpotlightTarget name="pulse-false">
						<SpotlightPulse pulse={false} radius={3}>
							<Button>This has no animation</Button>
						</SpotlightPulse>
					</SpotlightTarget>
				</ButtonGroup>
			</SpotlightManager>
		</div>
	);
};

export default SpotlightPulseExample;
