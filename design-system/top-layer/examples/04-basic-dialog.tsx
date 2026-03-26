/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Dialog, type TDialogCloseReason } from '@atlaskit/top-layer/dialog';

const styles = cssMap({
	dialogCard: {
		width: '480px',
		// @ts-expect-error -- calc() not in cssMap's type union for maxBlockSize
		maxBlockSize: 'calc(100vh - 120px)',
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.large', '8px'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	dialogHeader: {
		paddingBlockStart: token('space.300'),
		paddingBlockEnd: token('space.200'),
		paddingInline: token('space.300'),
		borderBlockEndWidth: token('border.width'),
		borderBlockEndStyle: 'solid',
		borderBlockEndColor: token('color.border'),
	},
	dialogBody: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.300'),
	},
	dialogFooter: {
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.300'),
		paddingInline: token('space.300'),
		borderBlockStartWidth: token('border.width'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border'),
	},
});

const reasonAppearance: Record<TDialogCloseReason, 'moved' | 'inprogress'> = {
	escape: 'moved',
	'overlay-click': 'inprogress',
};

/**
 * Basic dialog using the native `<dialog>` element with `showModal()`.
 *
 * `Dialog` is a bare primitive — it provides the `<dialog>` lifecycle,
 * Escape handling, and backdrop click detection. All visual styling
 * is the consumer's responsibility.
 *
 * The `onClose` callback receives `{ reason }` indicating how it was closed:
 * - `'escape'`: user pressed Escape
 * - `'overlay-click'`: user clicked the backdrop
 */
export default function BasicDialogExample() {
	const [isOpen, setIsOpen] = useState(false);
	const [closeLog, setCloseLog] = useState<TDialogCloseReason[]>([]);

	const handleClose = useCallback(({ reason }: { reason: TDialogCloseReason }) => {
		setCloseLog((prev) => [...prev, reason]);
		setIsOpen(false);
	}, []);

	return (
		<Box padding="space.400">
			<Stack space="space.200">
				<Inline space="space.100" alignBlock="center">
					<Button appearance="primary" onClick={() => setIsOpen(true)} aria-haspopup="dialog">
						Open dialog
					</Button>
					{closeLog.length > 0 && (
						<Button appearance="subtle" onClick={() => setCloseLog([])}>
							Clear log
						</Button>
					)}
				</Inline>

				{closeLog.length > 0 && (
					<Stack space="space.100">
						<Text weight="bold">Close log:</Text>
						<Inline space="space.050" shouldWrap>
							{closeLog.map((reason, i) => (
								<Lozenge key={i} appearance={reasonAppearance[reason]}>
									{reason}
								</Lozenge>
							))}
						</Inline>
					</Stack>
				)}

				<Dialog onClose={handleClose} isOpen={isOpen} label="Basic dialog">
					<div css={styles.dialogCard}>
						<div css={styles.dialogHeader}>
							<Heading size="small">Dialog</Heading>
						</div>
						<div css={styles.dialogBody}>
							<Stack space="space.150">
								<Text>
									This dialog uses the native {'<dialog>'} element. Try closing it different ways to
									see the reason logged:
								</Text>
								<Box as="ul" paddingInlineStart="space.300">
									<li>
										<Text>
											Press <strong>Escape</strong> → <Lozenge appearance="moved">escape</Lozenge>
										</Text>
									</li>
									<li>
										<Text>
											Click the backdrop → <Lozenge appearance="inprogress">overlay-click</Lozenge>
										</Text>
									</li>
								</Box>
							</Stack>
						</div>
						<div css={styles.dialogFooter}>
							<Inline space="space.100" alignInline="end">
								<Button appearance="subtle" onClick={() => setIsOpen(false)}>
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
