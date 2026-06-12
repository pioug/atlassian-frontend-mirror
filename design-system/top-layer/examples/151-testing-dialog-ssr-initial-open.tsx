/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { dialogSlideUpAndFade } from '@atlaskit/top-layer/animations';
import { Dialog, type TDialogCloseReason } from '@atlaskit/top-layer/dialog';

const styles = cssMap({
	dialogCard: {
		width: '480px',
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.large', '8px'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	dialogHeader: {
		paddingBlockStart: token('space.300'),
		paddingBlockEnd: token('space.200'),
		paddingInline: token('space.300'),
	},
	dialogBody: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.300'),
	},
	dialogFooter: {
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.300'),
		paddingInline: token('space.300'),
	},
});

/**
 * Dialog with `isOpen={true}` on initial render. Used by tests; do not
 * modify without checking SSR + hydration coverage.
 */
export default function DialogSsrInitialOpenExample(): ReactNode {
	const [isOpen, setIsOpen] = useState(true);

	const handleClose = useCallback((_args: { reason: TDialogCloseReason }) => {
		setIsOpen(false);
	}, []);

	return (
		<Box padding="space.400">
			<Stack space="space.200">
				<Text>Page content behind the dialog.</Text>
				<Dialog
					onClose={handleClose}
					isOpen={isOpen}
					label="Initially open dialog"
					animate={dialogSlideUpAndFade()}
					testId="ssr-initial-open-dialog"
				>
					<div css={styles.dialogCard}>
						<div css={styles.dialogHeader}>
							<Heading size="small">Initially open dialog</Heading>
						</div>
						<div css={styles.dialogBody} data-testid="ssr-initial-open-dialog-body">
							<Text>This dialog is open on initial render.</Text>
						</div>
						<div css={styles.dialogFooter}>
							<Inline space="space.100" alignInline="end">
								<Button
									appearance="subtle"
									onClick={() => setIsOpen(false)}
									testId="ssr-initial-open-dialog-close"
								>
									Close
								</Button>
							</Inline>
						</div>
					</div>
				</Dialog>
			</Stack>
		</Box>
	);
}
