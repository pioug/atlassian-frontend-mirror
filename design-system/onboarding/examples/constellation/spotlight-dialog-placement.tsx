import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import CloseIcon from '@atlaskit/icon/core/migration/close--cross';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type Placement = (typeof options)[number];

const options = [
	'top right',
	'top center',
	'top left',
	'right bottom',
	'right middle',
	'right top',
	'bottom left',
	'bottom center',
	'bottom right',
	'left top',
	'left middle',
	'left bottom',
] as const;

const SpotlightDialogPlacement = () => {
	const [isSpotlightActive, setIsSpotlightActive] = useState(false);
	const [dialogPlacement, setDialogPlacement] = useState(0);
	const start = () => setIsSpotlightActive(true);
	const end = () => setIsSpotlightActive(false);
	const shiftPlacementOption = () => {
		if (dialogPlacement !== options.length - 1) {
			return setDialogPlacement(dialogPlacement + 1);
		}
		return setDialogPlacement(0);
	};
	const placement = options[dialogPlacement];

	return (
		<SpotlightManager>
			<SpotlightTarget name="placement">
				<Button>Example target</Button>
			</SpotlightTarget>

			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: token('space.200', '16px') }}>
				<Button appearance="primary" onClick={() => start()}>
					Show example spotlight
				</Button>
			</div>
			<SpotlightTransition>
				{isSpotlightActive ? (
					<Spotlight
						heading={`Dialog placement: ${placement}`}
						headingAfterElement={
							<Button
								iconBefore={
									<CloseIcon
										label="Close"
										LEGACY_primaryColor={N0}
										color={token('color.icon.inverse')}
									/>
								}
								onClick={() => end()}
							/>
						}
						actions={[
							{
								onClick: () => shiftPlacementOption(),
								text: 'Shift dialog placement',
							},
						]}
						dialogPlacement={placement as Placement}
						target="placement"
						key="placement"
						targetRadius={3}
						targetBgColor={N0}
					>
						You can set where the dialog should appear relative to the contents of the children. Try
						out the options by clicking the action below.
					</Spotlight>
				) : null}
			</SpotlightTransition>
		</SpotlightManager>
	);
};

export default SpotlightDialogPlacement;
