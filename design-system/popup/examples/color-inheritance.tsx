/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Popup from '@atlaskit/popup';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const containerStyles = cssMap({
	root: {
		color: token('color.text.accent.green'),
		borderStyle: 'solid',
		borderColor: token('color.border.accent.purple'),
		borderWidth: token('border.width'),
		borderRadius: token('radius.small'),
		paddingBlockStart: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		width: '500px',
	},
});

function Item({ shouldRenderToParent = false }: { shouldRenderToParent?: boolean }) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<Box>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => (
					<Box padding="space.100">
						Rendered in <strong>{shouldRenderToParent ? 'parent' : 'portal'}</strong>
					</Box>
				)}
				trigger={(triggerProps) => (
					<Button {...triggerProps} onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
				placement="bottom-start"
				shouldRenderToParent={shouldRenderToParent}
			/>
		</Box>
	);
}

export default function Example() {
	return (
		<Box padding="space.100">
			<Box xcss={containerStyles.root}>
				<Stack space="space.100">
					<Box as="strong">Parent element has green text color set</Box>
					<Inline space="space.1000">
						<Item shouldRenderToParent />
						<Item />
					</Inline>
				</Stack>
			</Box>
		</Box>
	);
}
