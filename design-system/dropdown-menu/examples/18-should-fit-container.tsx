import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '../src';

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
			<DropdownMenu<HTMLButtonElement>
				trigger={({ triggerRef, ...triggerProps }) => (
					<Button ref={triggerRef} {...triggerProps} shouldFitContainer>
						Page actions
					</Button>
				)}
				isOpen={isOpen}
				onOpenChange={(e) => {
					setIsOpen(e.isOpen);
					console.log('dropdown opened', e);
				}}
				testId="dropdown"
				shouldFitContainer
			>
				<DropdownItemGroup>
					<DropdownItem>Move</DropdownItem>
					<DropdownItem>Clone</DropdownItem>
					<DropdownItem>Delete</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
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
