/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { token } from '@atlaskit/tokens';

const wrapperStyles = css({
	display: 'flex',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
});

/**
 * This example shows the use of onboarding without <SpotlightPulse />. It also displays how it looks
 * when pulse={false}. Note that the pulse prop here is different to the one in <SpotlightPulse />.
 */
const SpotlightWithoutPulseExample = (): JSX.Element => {
	const [isSpotlightVisible, setIsSpotlightVisible] = useState(false);

	const toggleIsSpotlightVisible = useCallback(() => {
		setIsSpotlightVisible((isSpotlightVisible) => !isSpotlightVisible);
	}, [setIsSpotlightVisible]);

	return (
		<div css={wrapperStyles} data-testid="spotlight-examples">
			<SpotlightManager blanketIsTinted={false}>
				<SpotlightTarget name="button">
					<Button testId="open-spotlight" onClick={toggleIsSpotlightVisible}>
						New feature
					</Button>
				</SpotlightTarget>
				<SpotlightTransition>
					{isSpotlightVisible && (
						<Spotlight
							target="button"
							actionsBeforeElement="1/3"
							targetBgColor={token('elevation.surface.raised')}
							actions={[
								{
									onClick: toggleIsSpotlightVisible,
									text: 'Got it',
								},
							]}
							pulse={false}
							label="No pulse spotlight"
						>
							This spotlight target does not show a pulse keyframe. Note that this is specific to
							Spotlight and is different to the pulse in SpotlightPulse.
						</Spotlight>
					)}
				</SpotlightTransition>
			</SpotlightManager>
		</div>
	);
};

export default SpotlightWithoutPulseExample;
