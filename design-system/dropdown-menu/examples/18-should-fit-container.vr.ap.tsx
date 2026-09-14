import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	spacer: {
		marginBlockStart: token('space.800'),
		marginInlineEnd: token('space.800'),
		marginBlockEnd: token('space.800'),
		marginInlineStart: token('space.800'),
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

const ShouldFitContainerExampleWithInitialClosed = (): React.JSX.Element => (
	<ShouldFitContainerExample isOpenInitial={false} />
);

export const ShouldFitContainerExampleWithInitialOpen = (): React.JSX.Element => (
	<ShouldFitContainerExample isOpenInitial />
);

export default ShouldFitContainerExampleWithInitialClosed;
