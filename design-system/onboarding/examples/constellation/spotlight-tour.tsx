import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button, { IconButton } from '@atlaskit/button/new';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import CodeSandboxIcon from './example-components/code-sandbox-icon';

const SpotlightTourExample = () => {
	const [activeSpotlight, setActiveSpotlight] = useState<null | number>(null);
	const start = () => setActiveSpotlight(0);
	const next = () => setActiveSpotlight((activeSpotlight || 0) + 1);
	const back = () => setActiveSpotlight((activeSpotlight || 1) - 1);
	const end = () => setActiveSpotlight(null);

	const renderActiveSpotlight = () => {
		const spotlights = [
			<Spotlight
				actions={[
					{
						onClick: () => next(),
						text: 'Next',
					},
					{ onClick: () => end(), text: 'Dismiss', appearance: 'subtle' },
				]}
				heading="Open CodeSandbox"
				target="codesandbox"
				key="codesandbox"
				targetRadius={3}
				targetBgColor={N0}
			>
				A sandboxed environment where you can play around with examples is now only one click away.
			</Spotlight>,
			<Spotlight
				actions={[
					{ onClick: () => end(), text: 'OK' },
					{ onClick: () => back(), text: 'Go back', appearance: 'subtle' },
				]}
				heading="Copy code"
				target="copy"
				key="copy"
				targetRadius={3}
				targetBgColor={N0}
			>
				Trying to bring one of our components into your project? Click to copy the example code,
				then go ahead paste it in your editor.
			</Spotlight>,
		];

		if (activeSpotlight === null) {
			return null;
		}

		return spotlights[activeSpotlight];
	};

	return (
		<SpotlightManager>
			<ButtonGroup label="Choose spotlight options">
				<SpotlightTarget name="codesandbox">
					<IconButton icon={CodeSandboxIcon} label="codesandbox" />
				</SpotlightTarget>
				<SpotlightTarget name="copy">
					<IconButton icon={CopyIcon} label="Copy" />
				</SpotlightTarget>
			</ButtonGroup>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: token('space.200', '16px') }}>
				<Button appearance="primary" onClick={() => start()}>
					Start example tour
				</Button>
			</div>

			<SpotlightTransition>{renderActiveSpotlight()}</SpotlightTransition>
		</SpotlightManager>
	);
};

export default SpotlightTourExample;
