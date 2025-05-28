/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import Popup, { ContentProps, TriggerProps } from '@atlaskit/popup';
import { Box, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

export default function InsidePopupExample() {
	setBooleanFeatureFlagResolver((key) => key === 'platform-tooltip-focus-visible');
	const [isOpen, setIsOpen] = useState(false);

	const renderContent = ({ setInitialFocusRef }: ContentProps) => (
		<Box xcss={wrapperStyles}>
			<Tooltip content="Only show on hover or focus-visible">
				<Button ref={setInitialFocusRef} onClick={() => {}}>
					Tooltip trigger
				</Button>
			</Tooltip>
		</Box>
	);

	const renderTrigger = (triggerProps: TriggerProps) => (
		<Button {...triggerProps} onClick={() => setIsOpen((current) => !current)}>
			Popup trigger
		</Button>
	);

	return (
		<Popup
			isOpen={isOpen}
			trigger={renderTrigger}
			content={renderContent}
			onClose={() => setIsOpen(false)}
		/>
	);
}

const wrapperStyles = xcss({
	paddingBlockEnd: 'space.100',
	paddingBlockStart: 'space.100',
	paddingInlineEnd: 'space.100',
	paddingInlineStart: 'space.100',
});
