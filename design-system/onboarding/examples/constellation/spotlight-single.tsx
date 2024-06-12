import React, { useState } from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { Spotlight, SpotlightManager, SpotlightTarget, SpotlightTransition } from '../../src';

import CodeSandboxIcon from './example-components/code-sandbox-icon';

const SpotlightTourExample = () => {
	const [isSpotlightActive, setIsSpotlightActive] = useState(false);
	const start = () => setIsSpotlightActive(true);
	const end = () => setIsSpotlightActive(false);
	return (
		<SpotlightManager>
			<SpotlightTarget name="codesandbox">
				<IconButton icon={CodeSandboxIcon} label="codesandbox" />
			</SpotlightTarget>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: token('space.200', '16px') }}>
				<Button appearance="primary" onClick={() => start()}>
					Show example spotlight
				</Button>
			</div>

			<SpotlightTransition>
				{isSpotlightActive && (
					<Spotlight
						actions={[
							{
								onClick: () => end(),
								text: 'OK',
							},
						]}
						heading="Open CodeSandbox"
						target="codesandbox"
						key="codesandbox"
						targetRadius={3}
						targetBgColor={N0}
					>
						A sandboxed environment where you can play around with examples is now only one click
						away.
					</Spotlight>
				)}
			</SpotlightTransition>
		</SpotlightManager>
	);
};

export default SpotlightTourExample;
