/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import Popup from '../src';

const containerStyles = xcss({
	color: 'color.text.accent.green',
	borderStyle: 'solid',
	borderColor: 'color.border.accent.purple',
	borderWidth: 'border.width',
	borderRadius: 'border.radius',
	padding: 'space.300',
	width: '500px',
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
			<Box xcss={containerStyles}>
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
