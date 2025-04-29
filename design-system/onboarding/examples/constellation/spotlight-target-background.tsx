import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button, { IconButton } from '@atlaskit/button/new';
import CommentAddIcon from '@atlaskit/icon/core/migration/comment-add--media-services-add-comment';
import CopyIcon from '@atlaskit/icon/core/migration/copy';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const SpotlightTargetBackground = () => {
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
				heading="No targetBgColor set"
				target="comment"
				key="comment"
				targetRadius={3}
			>
				You can see that even though the spotlight pulse surrounds the button, it no longer stands
				out on the page.
			</Spotlight>,
			<Spotlight
				targetBgColor={N0}
				actions={[
					{ onClick: () => end(), text: 'OK' },
					{ onClick: () => back(), text: 'Go back', appearance: 'subtle' },
				]}
				heading="With targetBg set"
				target="copy"
				key="copy"
				targetRadius={3}
			>
				Setting the `targetBgColor` ensures that the cloned spotlight target has all the context it
				needs to stand out properly.
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
				<SpotlightTarget name="comment">
					<IconButton icon={CommentAddIcon} label="comment" />
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

export default SpotlightTargetBackground;
