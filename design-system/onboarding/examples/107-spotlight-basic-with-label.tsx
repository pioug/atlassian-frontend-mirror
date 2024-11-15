/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const spotlightWrapperStyles = xcss({
	display: 'flex',
	height: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
});

const wrapperStyles = xcss({
	display: 'flex',
	justifyContent: 'space-between',
	padding: 'space.500',
});

const SpotlightWithLabelExample = () => {
	const [isSpotlightVisibleWithAriaLabelledBy, setIsSpotlightVisibleWithAriaLabelledBy] =
		useState(false);

	const [isSpotlightVisibleWithAriaLabel, setIsSpotlightVisibleWithAriaLabel] = useState(false);

	const toggleAriaLabelledBy = useCallback(() => {
		setIsSpotlightVisibleWithAriaLabelledBy(
			(isSpotlightVisibleWithAriaLabelledBy) => !isSpotlightVisibleWithAriaLabelledBy,
		);
	}, [setIsSpotlightVisibleWithAriaLabelledBy]);

	const toggleAriaLabel = useCallback(() => {
		setIsSpotlightVisibleWithAriaLabel(
			(isSpotlightVisibleWithAriaLabel) => !isSpotlightVisibleWithAriaLabel,
		);
	}, [setIsSpotlightVisibleWithAriaLabel]);

	return (
		<Box xcss={wrapperStyles}>
			<Box xcss={spotlightWrapperStyles} testId="spotlight-visible-label">
				<SpotlightManager blanketIsTinted={false}>
					<SpotlightTarget name="button">
						<Button testId="open-spotlight-referenced-label" onClick={toggleAriaLabelledBy}>
							Open spotlight
						</Button>
					</SpotlightTarget>
					<SpotlightTransition>
						{isSpotlightVisibleWithAriaLabelledBy && (
							<Spotlight
								target="button"
								testId="referenced-label"
								actionsBeforeElement="1/1"
								heading="Referenced spotlight label"
								targetBgColor={token('elevation.surface.raised')}
								actions={[
									{
										onClick: toggleAriaLabelledBy,
										text: 'Got it',
									},
								]}
								pulse={false}
							>
								<p>
									This spotlight has visible element to reference as a dialog accessible name using{' '}
									<code>aria-labelledby</code> attribute.
								</p>
							</Spotlight>
						)}
					</SpotlightTransition>
				</SpotlightManager>
			</Box>
			<Box xcss={spotlightWrapperStyles} testId="spotlight-hidden-label">
				<SpotlightManager blanketIsTinted={false}>
					<SpotlightTarget name="button">
						<Button testId="open-spotlight-explicit-label" onClick={toggleAriaLabel}>
							Open spotlight
						</Button>
					</SpotlightTarget>
					<SpotlightTransition>
						{isSpotlightVisibleWithAriaLabel && (
							<Spotlight
								target="button"
								testId="explicit-label"
								actionsBeforeElement="1/1"
								targetBgColor={token('elevation.surface.raised')}
								actions={[
									{
										onClick: toggleAriaLabel,
										text: 'Got it',
									},
								]}
								pulse={false}
							>
								<p>
									This spotlight has no visible element to reference as a dialog accessible name,
									which is why uses default <code>aria-label</code> value.
								</p>
							</Spotlight>
						)}
					</SpotlightTransition>
				</SpotlightManager>
			</Box>
		</Box>
	);
};

export default SpotlightWithLabelExample;
