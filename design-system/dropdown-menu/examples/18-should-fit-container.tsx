import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	spacer: {
		marginTop: token('space.800', '64px'),
		marginRight: token('space.800', '64px'),
		marginBottom: token('space.800', '64px'),
		marginLeft: token('space.800', '64px'),
	},
});

type ExampleProps = {
	isOpenInitial: boolean;
};

const ShouldFitContainerExample = ({ isOpenInitial }: ExampleProps) => {
	const [isOpen, setIsOpen] = useState(isOpenInitial);

	return (
		<Box xcss={styles.spacer}>
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
				shouldRenderToParent
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
