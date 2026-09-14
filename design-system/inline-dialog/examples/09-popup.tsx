import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import InlineDialog from '@atlaskit/inline-dialog/inline-dialog';

export default (): React.JSX.Element => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	return (
		<div data-testid="outside-modal">
			<InlineDialog
				onClose={() => {
					setIsDialogOpen(false);
				}}
				isOpen={isDialogOpen}
				content={
					<div>
						<DropdownMenu shouldRenderToParent trigger="Page actions" testId="dropdown">
							<DropdownItemGroup>
								<DropdownItem>Move</DropdownItem>
								<DropdownItem>Clone</DropdownItem>
								<DropdownItem>Delete</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</div>
				}
				testId="inline-dialog"
			>
				<Button testId="open-inline-dialog-button" onClick={() => setIsDialogOpen(true)}>
					Open Dialog
				</Button>
			</InlineDialog>
		</div>
	);
};
