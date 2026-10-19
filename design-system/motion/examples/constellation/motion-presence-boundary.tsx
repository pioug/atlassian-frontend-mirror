/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useId, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Motion from '@atlaskit/motion/entering/motion';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import MotionPresenceBoundary from '@atlaskit/motion/motion-presence-boundary';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Tag from '@atlaskit/tag/removable-tag';
import Toggle from '@atlaskit/toggle/toggle';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	preview: {
		minHeight: '160px',
		maxWidth: '320px',
	},
	panel: {
		marginBlockStart: token('space.100'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.medium'),
		boxShadow: token('elevation.shadow.overlay'),
	},
});

export default function MotionPresenceBoundaryExample(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [hasBoundary, setHasBoundary] = useState(true);
	const toggleId = useId();
	const panelId = useId();
	const Boundary = hasBoundary ? MotionPresenceBoundary : Fragment;

	return (
		<Stack space="space.200">
			<Inline space="space.100" alignBlock="center">
				<Toggle
					id={toggleId}
					isChecked={hasBoundary}
					onChange={(event) => {
						setHasBoundary(event.target.checked);
						setIsOpen(false);
					}}
				/>
				<label htmlFor={toggleId}>Use MotionPresenceBoundary</label>
			</Inline>
			<Text>
				{hasBoundary
					? 'The tag moves with the dropdown, without its own entry or exit animation.'
					: 'The tag inherits the dropdown’s presence and runs its own entry and exit animations.'}
			</Text>
			<div css={styles.preview}>
				<Button
					aria-expanded={isOpen}
					aria-controls={isOpen ? panelId : undefined}
					onClick={() => setIsOpen((open) => !open)}
					onKeyDown={(event) => {
						if (event.key === 'Escape') {
							setIsOpen(false);
						}
					}}
				>
					{isOpen ? 'Close dropdown' : 'Open dropdown'}
				</Button>
				<ExitingPersistence key={hasBoundary ? 'with-boundary' : 'without-boundary'} appear>
					{isOpen && (
						<Motion
							key="dropdown"
							enteringAnimation={token('motion.popup.enter.bottom')}
							exitingAnimation={token('motion.popup.exit.bottom')}
						>
							<div id={panelId} css={styles.panel}>
								<Boundary>
									<Stack space="space.100">
										<Text weight="bold">Labels</Text>
										<Inline>
											<Tag text="Design system" isRemovable={false} />
										</Inline>
									</Stack>
								</Boundary>
							</div>
						</Motion>
					)}
				</ExitingPersistence>
			</div>
		</Stack>
	);
}
