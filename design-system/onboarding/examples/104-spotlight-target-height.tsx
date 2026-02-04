/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { css, jsx } from '@compiled/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { Spotlight, SpotlightManager, SpotlightTarget } from '@atlaskit/onboarding';
import { token } from '@atlaskit/tokens';

const targetContainerStyles = css({
	width: 200,
	height: 400,
	marginBlockEnd: token('space.250'),
	marginBlockStart: token('space.250'),
	marginInlineEnd: token('space.250'),
	marginInlineStart: token('space.250'),
});

const targetStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	width: '100%',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: token('color.background.accent.gray.subtlest'),
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.100'),
	paddingInlineStart: token('space.100'),
});

function SpotlightTargetHeight(): JSX.Element {
	const [active, setActive] = useState(true);

	return (
		<SpotlightManager>
			<Button appearance="primary" onClick={() => setActive(true)}>
				Show spotlight
			</Button>
			<div css={targetContainerStyles}>
				<SpotlightTarget name="spotlight-1">
					<div css={targetStyles}>
						<Lorem count={1} />
					</div>
				</SpotlightTarget>
				{active && (
					<Spotlight
						heading="I am a spotlight"
						dialogPlacement="right top"
						target="spotlight-1"
						actions={[{ onClick: () => setActive(false), text: 'OK' }]}
					>
						<Lorem count={1} />
					</Spotlight>
				)}
			</div>
		</SpotlightManager>
	);
}

export default SpotlightTargetHeight;
