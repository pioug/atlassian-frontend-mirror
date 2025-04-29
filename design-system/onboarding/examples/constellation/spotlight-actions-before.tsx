import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button, { IconButton } from '@atlaskit/button/new';
import CommentAddIcon from '@atlaskit/icon/core/migration/comment-add--media-services-add-comment';
import CopyIcon from '@atlaskit/icon/core/migration/copy';
import FullscreenEnterIcon from '@atlaskit/icon/core/migration/fullscreen-enter--vid-full-screen-on';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const SpotlightActionsBefore = () => {
	const [activeSpotlight, setActiveSpotlight] = useState<null | number>(null);
	const start = () => setActiveSpotlight(0);
	const next = () => setActiveSpotlight((activeSpotlight || 0) + 1);
	const back = () => setActiveSpotlight((activeSpotlight || 1) - 1);
	const end = () => setActiveSpotlight(null);

	const renderActiveSpotlight = () => {
		const spotlights = [
			<Spotlight
				actionsBeforeElement="1/3"
				actions={[
					{
						onClick: () => next(),
						text: 'Next',
					},
					{ onClick: () => end(), text: 'Dismiss', appearance: 'subtle' },
				]}
				heading="Add a comment"
				target="comment"
				key="comment"
				targetRadius={3}
				targetBgColor={N0}
			>
				Quickly add a comment to the issue.
			</Spotlight>,
			<Spotlight
				actionsBeforeElement="2/3"
				actions={[
					{ onClick: () => next(), text: 'Next' },
					{ onClick: () => back(), text: 'Go back', appearance: 'subtle' },
					{ onClick: () => end(), text: 'Dismiss', appearance: 'subtle' },
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
			<Spotlight
				actionsBeforeElement="3/3"
				actions={[
					{ onClick: () => end(), text: 'OK' },
					{ onClick: () => back(), text: 'Go back', appearance: 'subtle' },
				]}
				heading="Expand to full screen"
				target="expand"
				key="expand"
				targetRadius={3}
				targetBgColor={N0}
			>
				For a focused view of the example, you can expand to full screen.
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
				<SpotlightTarget name="expand">
					<IconButton icon={FullscreenEnterIcon} label="Full screen" />
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

export default SpotlightActionsBefore;
