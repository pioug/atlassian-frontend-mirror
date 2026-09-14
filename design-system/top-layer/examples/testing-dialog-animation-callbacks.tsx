/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog-content';

const styles = cssMap({
	wrapper: {
		paddingBlock: token('space.800'),
		paddingInline: token('space.800'),
	},
	counts: {
		display: 'flex',
		gap: token('space.200'),
		marginBlockEnd: token('space.200'),
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		paddingBlock: token('space.300'),
		paddingInline: token('space.300'),
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.medium'),
	},
});

/**
 * Real-browser fixture for the Dialog animation callback lifecycle.
 */
export default function TestingDialogAnimationCallbacks(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const [enterCount, setEnterCount] = useState(0);
	const [exitCount, setExitCount] = useState(0);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const handleEnterFinish = useCallback(() => {
		setEnterCount((previous) => previous + 1);
	}, []);
	const handleExitFinish = useCallback(() => {
		setExitCount((previous) => previous + 1);
	}, []);

	return (
		<div css={styles.wrapper}>
			<div css={styles.counts}>
				<Text>
					Enter count: <span data-testid="dialog-enter-count">{enterCount}</span>
				</Text>
				<Text>
					Exit count: <span data-testid="dialog-exit-count">{exitCount}</span>
				</Text>
			</div>
			<Button testId="dialog-trigger" onClick={open}>
				Open dialog
			</Button>
			<Dialog
				isOpen={isOpen}
				onClose={close}
				onEnterFinish={handleEnterFinish}
				onExitFinish={handleExitFinish}
				label="Animation callback test dialog"
				shouldAnimate
			>
				<div css={styles.content} data-testid="dialog-content">
					<Text>Animated dialog content</Text>
					<Button testId="dialog-close" onClick={close}>
						Close
					</Button>
				</div>
			</Dialog>
		</div>
	);
}
