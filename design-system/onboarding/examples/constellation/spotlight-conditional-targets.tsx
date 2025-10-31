import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button, { IconButton } from '@atlaskit/button/new';
import CommentAddIcon from '@atlaskit/icon/core/comment-add';
import CopyIcon from '@atlaskit/icon/core/copy';
import FullscreenEnterIcon from '@atlaskit/icon/core/fullscreen-enter';
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
	useSpotlight,
} from '@atlaskit/onboarding';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const SpotlightWithConditionalTargets = () => {
	const [active, setActive] = useState<number | null>(null);
	const [isSecondTargetVisible, setIsSecondTargetVisible] = useState(true);
	const { isTargetRendered } = useSpotlight();

	const start = () => setActive(0);
	const next = () => setActive((active || 0) + 1);
	const back = () => setActive((active || 0) - 1);
	const end = () => setActive(null);

	const renderActiveSpotlight = () => {
		if (active == null) {
			return null;
		}

		const spotlights = [
			{
				target: 'comment',
				element: (
					<Spotlight
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
						Quickly add a comment to the work item.
					</Spotlight>
				),
			},
			{
				target: 'copy',
				element: (
					<Spotlight
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
					</Spotlight>
				),
			},
			{
				target: 'expand',
				element: (
					<Spotlight
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
					</Spotlight>
				),
			},
		]
			.filter(({ target }) => isTargetRendered(target))
			.map(({ element }) => element);

		return spotlights[active];
	};

	return (
		<>
			<ButtonGroup label="Choose spotlight options">
				<SpotlightTarget name="comment">
					<IconButton icon={CommentAddIcon} label="comment" />
				</SpotlightTarget>
				{isSecondTargetVisible && (
					<SpotlightTarget name="copy">
						<IconButton icon={CopyIcon} label="Copy" />
					</SpotlightTarget>
				)}
				<SpotlightTarget name="expand">
					<IconButton icon={FullscreenEnterIcon} label="Full screen" />
				</SpotlightTarget>
			</ButtonGroup>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ marginTop: token('space.200') }}>
				<ButtonGroup label="Choose spotlight options">
					<Button appearance="primary" onClick={() => start()}>
						Start example tour
					</Button>
					<Button onClick={() => setIsSecondTargetVisible(!isSecondTargetVisible)}>
						Show/hide second spotlight target
					</Button>
				</ButtonGroup>
			</div>
			<SpotlightTransition>{renderActiveSpotlight()}</SpotlightTransition>
		</>
	);
};

export default function SpotlightWithConditionalTargetsExample() {
	return (
		<SpotlightManager>
			<SpotlightWithConditionalTargets />
		</SpotlightManager>
	);
}
