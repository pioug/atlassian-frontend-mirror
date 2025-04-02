import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import ModalDialog, {
	ModalBody,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives';
import Stack from '@atlaskit/primitives/stack';

export default () => {
	const [isModalOpen, setModalOpen] = useState(false);

	return (
		<Stack space="space.250">
			<Heading size="large">
				Open dropdown in iframe, clicking outside iframe should close the dropdown correctly.
			</Heading>
			<iframe
				title="dropdown"
				src="http://localhost:9000/examples.html?groupId=design-system&packageId=dropdown-menu&exampleId=nested-dropdown&mode=light&locale=en-US&featureFlag=design-system-closed-all-when-click-outside&featureFlag=platform-design-system-apply-popup-wrapper-focus&featureFlag=sibling-dropdown-close-issue&featureFlag=select-avoid-duplicated-registered-ref&featureFlag=fix-dropdown-close-outside-iframe"
			/>

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
