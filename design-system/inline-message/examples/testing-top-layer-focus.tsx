import React from 'react';

import Button from '@atlaskit/button/new';
import InlineMessage from '@atlaskit/inline-message';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';

/**
 * Test fixture for the `InlineMessage` top-layer focus contract.
 *
 * `InlineMessage` opens its content inside a `role="dialog"` popover (via the
 * `@atlaskit/popup` it composes). The popover content here holds two focusable
 * buttons so the spec can exercise initial focus, focus restoration, and focus
 * movement within the popover.
 *
 * See `__tests__/playwright/top-layer-focus.spec.tsx` for the asserted contract.
 */
export default function TestingTopLayerFocus(): React.ReactNode {
	return (
		<Box padding="space.200">
			<InlineMessage
				appearance="info"
				title="Inline message"
				secondaryText="Open the dialog"
				testId="inline-message"
			>
				<Stack space="space.100">
					<Text>This popover contains focusable content.</Text>
					<Button testId="inline-message-first-button">First action</Button>
					<Button testId="inline-message-second-button">Second action</Button>
				</Stack>
			</InlineMessage>
		</Box>
	);
}
