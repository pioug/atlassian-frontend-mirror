import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import Heading from '@atlaskit/heading/heading';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Box } from '@atlaskit/primitives/compiled';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import Stack from '@atlaskit/primitives/stack';

export default (): React.JSX.Element => {
	const [isModalOpen, setModalOpen] = useState(false);

	return (
		<Stack space="space.250">
			<Heading size="large">
				Click dropdown button and try to open the modal using your keyboard.
			</Heading>

			<Box>
				<DropdownMenu
					trigger="Open dropdown"
					testId="dropdown"
					onOpenChange={(e) => console.log('dropdown opened', e)}
					shouldRenderToParent
				>
					<DropdownItemGroup>
						<DropdownItem
							onClick={(e: React.MouseEvent | React.KeyboardEvent) => {
								e.preventDefault();

								setModalOpen(true);
							}}
						>
							Open modal
						</DropdownItem>
					</DropdownItemGroup>
				</DropdownMenu>
			</Box>

			<ModalTransition>
				{isModalOpen && (
					<ModalDialog testId="dialogBox" onClose={() => setModalOpen(false)}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Hi there</ModalTitle>
						</ModalHeader>

						<ModalBody>
							<Box paddingBlock="space.250">
								<Button onClick={() => setModalOpen(false)}>Close modal</Button>
								<DropdownMenu
									trigger="Open dropdown"
									testId="dropdown"
									onOpenChange={(e) => console.log('dropdown opened', e)}
									shouldRenderToParent
								>
									<DropdownItemGroup>
										<DropdownItem
											onClick={(e: React.MouseEvent | React.KeyboardEvent) => {
												e.preventDefault();

												setModalOpen(true);
											}}
										>
											Open modal
										</DropdownItem>
									</DropdownItemGroup>
								</DropdownMenu>
							</Box>
						</ModalBody>
					</ModalDialog>
				)}
			</ModalTransition>
		</Stack>
	);
};
