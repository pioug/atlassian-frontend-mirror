/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import Popup from '@atlaskit/popup';
import { Box, xcss } from '@atlaskit/primitives';

const spacerStyles = xcss({
	margin: 'space.800',
});

type ExampleProps = {
	isOpenInitial: boolean;
};

const ShouldFitContainerExample = ({ isOpenInitial }: ExampleProps) => {
	const [isOpen, setIsOpen] = useState(isOpenInitial);

	return (
		<Box xcss={spacerStyles}>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				content={() => <p>Hello</p>}
				trigger={(triggerProps) => (
					<Button
						id="popup-trigger"
						{...triggerProps}
						onClick={() => setIsOpen(!isOpen)}
						shouldFitContainer
					>
						{isOpen ? 'Close' : 'Open'} Popup
					</Button>
				)}
				placement="bottom-start"
				shouldFitContainer
			/>
		</Box>
	);
};

const ShouldFitContainerExampleWithInitialClosed = () => (
	<ShouldFitContainerExample isOpenInitial={false} />
);

export const ShouldFitContainerExampleWithInitialOpen = () => (
	<ShouldFitContainerExample isOpenInitial />
);

export default ShouldFitContainerExampleWithInitialClosed;
