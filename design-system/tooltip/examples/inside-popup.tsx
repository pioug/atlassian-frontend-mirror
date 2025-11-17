/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup, { type ContentProps, type TriggerProps } from '@atlaskit/popup';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

export default function InsidePopupExample() {
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
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
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
			shouldRenderToParent={fg('should-render-to-parent-should-be-true-design-syst')}
		/>
	);
}

const wrapperStyles = xcss({
	paddingBlockEnd: 'space.100',
	paddingBlockStart: 'space.100',
	paddingInlineEnd: 'space.100',
	paddingInlineStart: 'space.100',
});
