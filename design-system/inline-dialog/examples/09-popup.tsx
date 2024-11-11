import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import InlineDialog from '@atlaskit/inline-dialog';

export default () => {
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
						<DropdownMenu trigger="Page actions" testId="dropdown">
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
