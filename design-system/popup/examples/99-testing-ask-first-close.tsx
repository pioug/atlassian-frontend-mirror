import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Popup } from '@atlaskit/popup/popup';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

type TCloseEvent = Event | React.MouseEvent | React.KeyboardEvent | null;

/**
 * The close reason that `onClose` gets, as a short word for the log.
 */
function getCloseReason(event: TCloseEvent): string {
	if (event && 'key' in event && event.key === 'Escape') {
		return 'escape';
	}
	if (event instanceof MouseEvent) {
		return 'outside-press';
	}
	return 'other';
}

/**
 * Test fixture (smoke test): on the top layer, `Popup` asks `onClose` first, and closes only when
 * `isOpen` becomes `false`. The switch makes `onClose` refuse. The log lists each `onClose` call.
 * `@atlaskit/top-layer` covers the behaviour in full (`manual-ask-first-close.spec.tsx`).
 *
 * See `@atlaskit/top-layer` `notes/decisions/wrappers-ask-first-close.md`.
 */
export default function TestingAskFirstClose(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const [isRefusing, setIsRefusing] = useState(false);
	const [log, setLog] = useState<string[]>([]);

	return (
		<Box padding="space.500">
			<Stack space="space.200">
				<Inline space="space.100">
					<Button
						testId="refuse"
						isSelected={isRefusing}
						onClick={() => setIsRefusing(!isRefusing)}
					>
						Refuse close
					</Button>
					<Button testId="outside">Outside</Button>
				</Inline>
				<Popup
					isOpen={isOpen}
					onClose={(event) => {
						setLog((current) => [...current, getCloseReason(event)]);
						if (!isRefusing) {
							setIsOpen(false);
						}
					}}
					role="dialog"
					label="Ask first popup"
					testId="popup"
					placement="bottom-start"
					shouldRenderToParent
					trigger={(triggerProps) => (
						<Button
							{...triggerProps}
							testId="trigger"
							onClick={() => setIsOpen((current) => !current)}
						>
							Trigger
						</Button>
					)}
					content={() => (
						<Box padding="space.200">
							<Button testId="inside">Inside</Button>
						</Box>
					)}
				/>
				<Text as="p" testId="close-log">
					{log.join(' ')}
				</Text>
			</Stack>
		</Box>
	);
}
