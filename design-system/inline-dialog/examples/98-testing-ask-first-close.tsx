import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import InlineDialog from '@atlaskit/inline-dialog/inline-dialog';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

/**
 * The close reason that `onClose` gets, as a short word for the log.
 */
function getCloseReason({ event }: { event: Event }): string {
	if (event instanceof KeyboardEvent && event.key === 'Escape') {
		return 'escape';
	}
	if (event instanceof MouseEvent) {
		return 'outside-press';
	}
	return 'other';
}

/**
 * Test fixture: on the top layer, `InlineDialog` asks `onClose` first, and closes only when
 * `isOpen` becomes `false`. The switch makes `onClose` refuse. The log lists each `onClose` call.
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
				<InlineDialog
					testId="inline-dialog"
					isOpen={isOpen}
					onClose={({ event }) => {
						setLog((current) => [...current, getCloseReason({ event })]);
						if (!isRefusing) {
							setIsOpen(false);
						}
					}}
					content={<Button testId="inside">Inside</Button>}
				>
					<Button testId="trigger" onClick={() => setIsOpen((current) => !current)}>
						Trigger
					</Button>
				</InlineDialog>
				<Text as="p" testId="close-log">
					{log.join(' ')}
				</Text>
			</Stack>
		</Box>
	);
}
