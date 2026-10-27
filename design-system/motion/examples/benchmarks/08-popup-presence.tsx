/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useId, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Motion from '@atlaskit/motion/entering/motion';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { BenchmarkLayout } from './shared';

const styles = cssMap({
	preview: {
		minHeight: '200px',
	},
	popup: {
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.medium'),
		boxShadow: token('elevation.shadow.overlay'),
		marginBlockStart: token('space.100'),
		maxWidth: '320px',
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
	},
	label: {
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.small'),
		paddingBlockStart: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
	},
});

/**
 * Benchmark prompt:
 * This popup contains labels with their own motion. Fix the motion so closing the popup is
 * controlled by the popup and does not wait for or force the label animations.
 */
export default function PopupPresenceBenchmark(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const popupId = useId();

	return (
		<BenchmarkLayout title="Popup presence" description="Open and close the label popup.">
			<div css={styles.preview}>
				<Button
					aria-controls={popupId}
					aria-expanded={isOpen}
					onClick={() => setIsOpen((open) => !open)}
				>
					{isOpen ? 'Close labels' : 'Open labels'}
				</Button>
				<ExitingPersistence appear>
					{isOpen && (
						<Motion
							key="popup"
							enteringAnimation={token('motion.popup.enter.bottom')}
							exitingAnimation={token('motion.popup.exit.bottom')}
						>
							<div id={popupId} css={styles.popup}>
								<Stack space="space.100">
									<Text weight="semibold">Labels</Text>
									<Inline space="space.100">
										{['Design', 'Research'].map((label) => (
											<Motion
												key={label}
												enteringAnimation={token('motion.modal.enter')}
												exitingAnimation={token('motion.modal.exit')}
											>
												<span css={styles.label}>{label}</span>
											</Motion>
										))}
									</Inline>
								</Stack>
							</div>
						</Motion>
					)}
				</ExitingPersistence>
			</div>
		</BenchmarkLayout>
	);
}
