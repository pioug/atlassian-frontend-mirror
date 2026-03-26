/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog';
import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { Popup } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

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
 * Popup inside a dialog. Demonstrates cross-layer interaction.
 *
 * The popup renders in the top layer above the dialog.
 * Escape closes the popup first (if open), then the dialog.
 */
export default function PopoverInsideDialogExample() {
	const [isOpen, setIsOpen] = useState(false);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Box padding="space.400">
					<Button appearance="primary" onClick={() => setIsOpen(true)} aria-haspopup="dialog">
						Open dialog with popup
					</Button>
					<Dialog onClose={handleClose} isOpen={isOpen} label="Dialog with popup">
						<div css={styles.dialogCard}>
							<div css={styles.dialogHeader}>
								<Heading size="small">Dialog with popup</Heading>
							</div>
							<div css={styles.dialogBody}>
								<Stack space="space.200">
									<Text>
										This dialog contains a popup trigger. The popup renders above the dialog in the
										top layer.
									</Text>
									<Box>
										<Popup
											placement={{ edge: 'end' }}
											onClose={() => {}}
											onOpenChange={({ isOpen: popupIsOpen, element }) => {
												if (popupIsOpen) {
													getFirstFocusable({ container: element })?.focus();
												}
											}}
											forceFallbackPositioning={forceFallbackPositioning}
										>
											<Popup.Trigger>
												<Button>Open popup</Button>
											</Popup.Trigger>
											<Popup.Content role="dialog" label="Actions">
												<PopupSurface>
													<Stack space="space.050">
														<Heading size="xxsmall">Actions</Heading>
														<Button appearance="subtle">Edit</Button>
														<Button appearance="subtle">Duplicate</Button>
														<Button appearance="subtle">Delete</Button>
													</Stack>
												</PopupSurface>
											</Popup.Content>
										</Popup>
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
