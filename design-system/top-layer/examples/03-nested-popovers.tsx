import React from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { getFirstFocusable } from '@atlaskit/top-layer/focus';
import { Popup } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

/**
 * Nested popups using the native Popover API.
 *
 * When a child popup is inside a parent popup in the DOM,
 * the browser recognizes them as nested:
 * - Pressing Escape closes only the topmost (innermost) popup
 * - Light dismiss (clicking outside) closes the entire stack
 */
function handleOpenChange({ isOpen, element }: { isOpen: boolean; element: HTMLDivElement }) {
	if (isOpen) {
		getFirstFocusable({ container: element })?.focus();
	}
}

export default function NestedPopoversExample() {
	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Box padding="space.400">
					<Popup
						placement={{ edge: 'end' }}
						onClose={() => {}}
						onOpenChange={handleOpenChange}
						forceFallbackPositioning={forceFallbackPositioning}
					>
						<Popup.Trigger>
							<Button appearance="primary">Open first popup</Button>
						</Popup.Trigger>
						<Popup.Content role="dialog" label="First popup">
							<PopupSurface>
								<Stack space="space.150">
									<Heading size="xsmall">First popup</Heading>
									<Text>This is the outer popup. Open the nested one:</Text>
									<Popup
										placement={{ axis: 'inline', edge: 'end' }}
										onClose={() => {}}
										onOpenChange={handleOpenChange}
										forceFallbackPositioning={forceFallbackPositioning}
									>
										<Popup.Trigger>
											<Button>Open nested popup</Button>
										</Popup.Trigger>
										<Popup.Content role="dialog" label="Nested popup">
											<PopupSurface>
												<Stack space="space.100">
													<Heading size="xsmall">Nested popup</Heading>
													<Text>
														Escape closes this one only. Clicking outside
														closes both.
													</Text>
												</Stack>
											</PopupSurface>
										</Popup.Content>
									</Popup>
								</Stack>
							</PopupSurface>
						</Popup.Content>
					</Popup>
				</Box>
			)}
		</ForceFallbackToggle>
	);
}
