import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Flag, { FlagGroup } from '@atlaskit/flag';
import InformationIcon from '@atlaskit/icon/core/status-information';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box, Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

function FlagsInModalDialogExample(): React.JSX.Element {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [flags, setFlags] = useState<Array<number>>([]);

	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	const addFlag = useCallback(() => {
		setFlags((prevFlags) => {
			const newFlagId = prevFlags.length + 1;
			const newFlags = prevFlags.slice();
			newFlags.splice(0, 0, newFlagId);
			return newFlags;
		});
	}, []);

	const handleDismissFlag = useCallback(() => {
		setFlags((prevFlags) => prevFlags.slice(1));
	}, []);

	return (
		<Box>
			<Button appearance="primary" onClick={openModal}>
				Open modal
			</Button>
			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal} testId="modal">
						<ModalHeader hasCloseButton>
							<ModalTitle>Modal Title</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Button onClick={addFlag}>Add flag</Button>
							<FlagGroup onDismissed={handleDismissFlag} shouldRenderToParent>
								{flags.map((flagId) => {
									return (
										<Flag
											id={flagId}
											icon={
												<Flex xcss={iconSpacingStyles.space050}>
													<InformationIcon label="Info" color={token('color.icon.information')} />
												</Flex>
											}
											key={flagId}
											title={`Flag #${flagId}`}
											description="Example flag description"
										/>
									);
								})}
							</FlagGroup>
						</ModalBody>
						<ModalFooter>
							<Button testId="primary" appearance="primary" onClick={closeModal}>
								Close
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</Box>
	);
}

export default FlagsInModalDialogExample;
