/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useEffect, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives/compiled';
import {
	PopoverContent,
	PopoverProvider,
	PopoverTarget,
	SpotlightActions,
	SpotlightBody,
	SpotlightCard,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightPrimaryAction,
} from '@atlaskit/spotlight';

const SpotlightTourExample = (props: { children: React.ReactNode; onModalReady: boolean }) => {
	const { children, onModalReady } = props;
	const [isSpotlightActive, setIsSpotlightActive] = useState(false);
	const end = () => setIsSpotlightActive(false);

	// Wait for modal animation to complete before showing spotlight
	useEffect(() => {
		if (onModalReady) {
			setIsSpotlightActive(true);
		}
	}, [onModalReady]);

	return (
		<PopoverProvider>
			<PopoverTarget>
				<div>{children}</div>
			</PopoverTarget>
			<PopoverContent dismiss={end} placement="right-end" isVisible={isSpotlightActive}>
				<SpotlightCard>
					<SpotlightHeader>
						<SpotlightHeadline>Change onboarding</SpotlightHeadline>
						<SpotlightControls>
							<SpotlightDismissControl />
						</SpotlightControls>
					</SpotlightHeader>
					<SpotlightBody>
						<Text>This is the body of the onboarding. It will contain message.</Text>
					</SpotlightBody>
					<SpotlightFooter>
						<SpotlightActions>
							<SpotlightPrimaryAction onClick={end}>Done</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</SpotlightCard>
			</PopoverContent>
		</PopoverProvider>
	);
};

export default function ModalWithSpotlight(): JSX.Element {
	const [isModalAnimationComplete, setIsModalAnimationComplete] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(true);
	const close = useCallback(() => setIsModalOpen(false), []);
	const handleModalOpenComplete = useCallback(() => {
		setIsModalAnimationComplete(true);
	}, []);

	return (
		<ModalTransition>
			{isModalOpen && (
				<ModalDialog onOpenComplete={handleModalOpenComplete} onClose={close}>
					<ModalHeader hasCloseButton>
						<ModalTitle>Work Item Transition</ModalTitle>
					</ModalHeader>
					<ModalBody>This is Work Item Transition Modal Body.</ModalBody>
					<ModalFooter>
						<Button appearance="subtle" onClick={close}>
							Cancel
						</Button>
						<SpotlightTourExample onModalReady={isModalAnimationComplete}>
							<Button appearance="primary" onClick={close}>
								Create
							</Button>
						</SpotlightTourExample>
					</ModalFooter>
				</ModalDialog>
			)}
		</ModalTransition>
	);
}
