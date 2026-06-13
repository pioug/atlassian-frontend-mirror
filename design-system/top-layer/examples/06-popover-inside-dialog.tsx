/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type ReactNode, useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog';
import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { Popover } from '@atlaskit/top-layer/popover';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

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

/**
 * Popover inside a dialog. Demonstrates cross-layer interaction.
 *
 * The popover renders in the top layer above the dialog.
 * Escape closes the popover first (if open), then the dialog.
 */
function PopoverInDialog({
	forceFallbackPositioning,
}: {
	forceFallbackPositioning: boolean;
}): ReactNode {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();

	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement: { edge: 'end' },
		forceFallbackPositioning,
		isOpen,
	});

	return (
		<Fragment>
			<Button
				ref={triggerRef}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId: popoverId })}
			>
				Open popover
			</Button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				role="dialog"
				label="Actions"
				isOpen={isOpen}
				onClose={close}
				onOpenChange={({ isOpen: nextOpen, element }) => {
					if (nextOpen) {
						getFirstFocusable({ container: element })?.focus();
					}
				}}
			>
				<PopoverSurface>
					<Stack space="space.050">
						<Heading size="xxsmall">Actions</Heading>
						<Button appearance="subtle">Edit</Button>
						<Button appearance="subtle">Duplicate</Button>
						<Button appearance="subtle">Delete</Button>
					</Stack>
				</PopoverSurface>
			</Popover>
		</Fragment>
	);
}

export default function PopoverInsideDialogExample(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Box padding="space.400">
					<Button appearance="primary" onClick={() => setIsOpen(true)} aria-haspopup="dialog">
						Open dialog with popover
					</Button>
					<Dialog onClose={handleClose} isOpen={isOpen} label="Dialog with popover">
						<div css={styles.dialogCard}>
							<div css={styles.dialogHeader}>
								<Heading size="small">Dialog with popover</Heading>
							</div>
							<div css={styles.dialogBody}>
								<Stack space="space.200">
									<Text>
										This dialog contains a popover trigger. The popover renders above the dialog in
										the top layer.
									</Text>
									<Box>
										<PopoverInDialog forceFallbackPositioning={forceFallbackPositioning} />
									</Box>
								</Stack>
							</div>
							<div css={styles.dialogFooter}>
								<Inline space="space.100" alignInline="end">
									<Button appearance="subtle" onClick={handleClose}>
										Close
									</Button>
								</Inline>
							</div>
						</div>
					</Dialog>
				</Box>
			)}
		</ForceFallbackToggle>
	);
}
