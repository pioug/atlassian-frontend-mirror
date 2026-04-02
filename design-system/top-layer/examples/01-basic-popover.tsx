import React, { useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { Popup } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

/**
 * Basic popup using the native Popover API.
 *
 * Demonstrates three key behaviors:
 * - **Light dismiss**: Click outside or press Escape to close (inherent to `popover="auto"`)
 * - **onClose tracking**: The `onClose` callback fires on every dismiss
 * - **Programmatic close**: Call `hidePopover()` on the underlying element via a ref
 */
export default function BasicPopupExample(): React.JSX.Element {
	const popoverRef = useRef<HTMLDivElement | null>(null);
	const [closeCount, setCloseCount] = useState(0);

	const handleClose = useCallback(() => {
		setCloseCount((c) => c + 1);
	}, []);

	function handleProgrammaticClose() {
		popoverRef.current?.hidePopover();
	}

	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Box padding="space.400">
					<Stack space="space.200">
						<Inline space="space.100" alignBlock="center">
							<Text>Close count:</Text>
							<Lozenge appearance={closeCount > 0 ? 'moved' : 'default'}>{closeCount}</Lozenge>
						</Inline>
						<Box>
							<Popup
								placement={{ edge: 'end' }}
								onClose={handleClose}
								onOpenChange={({ isOpen, element }) => {
									if (isOpen) {
										getFirstFocusable({ container: element })?.focus();
									}
								}}
								forceFallbackPositioning={forceFallbackPositioning}
							>
								<Popup.Trigger>
									<Button appearance="primary">Open popup</Button>
								</Popup.Trigger>
								<Popup.Content ref={popoverRef} role="dialog" label="Basic popup">
									<PopupSurface>
										<Stack space="space.150">
											<Heading size="xsmall">Popup</Heading>
											<Text>Click outside or press Escape to dismiss.</Text>
											<Box>
												<Button appearance="subtle" onClick={handleProgrammaticClose}>
													Close programmatically
												</Button>
											</Box>
										</Stack>
									</PopupSurface>
								</Popup.Content>
							</Popup>
						</Box>
					</Stack>
				</Box>
			)}
		</ForceFallbackToggle>
	);
}
