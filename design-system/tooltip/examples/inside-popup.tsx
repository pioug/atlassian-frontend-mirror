/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { Popup } from '@atlaskit/popup/popup';
import type { ContentProps, TriggerProps } from '@atlaskit/popup/types';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

export default function InsidePopupExample(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	const renderContent = ({ setInitialFocusRef }: ContentProps) => (
		<Box xcss={wrapperStyles.root}>
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
			shouldRenderToParent
		/>
	);
}

const wrapperStyles = cssMap({
	root: {
		paddingBlockEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});
