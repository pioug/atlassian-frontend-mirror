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
import {
	Spotlight,
	SpotlightManager,
	SpotlightTarget,
	SpotlightTransition,
} from '@atlaskit/onboarding';

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
		<SpotlightManager blanketIsTinted={false}>
			<SpotlightTarget name="codesandbox">
				<div>{children}</div>
			</SpotlightTarget>
			<SpotlightTransition>
				{isSpotlightActive && (
					<Spotlight
						actions={[
							{
								onClick: () => end(),
								text: 'OK',
							},
						]}
						dialogPlacement="right top"
						heading="Change onboarding"
						target="codesandbox"
					>
						This is the body of the onboarding. It will contain message.
					</Spotlight>
				)}
			</SpotlightTransition>
		</SpotlightManager>
	);
};

export default function ModalWithSpotlight() {
	const [isModalAnimationComplete, setIsModalAnimationComplete] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(true);
	const close = useCallback(() => setIsModalOpen(false), []);
	const handleModalOpenComplete = useCallback((node: HTMLElement, isAppearing: boolean) => {
		setIsModalAnimationComplete(true);
	}, []);

	return (
		<ModalTransition>
			{isModalOpen && (
				<ModalDialog onOpenComplete={handleModalOpenComplete}>
					<ModalHeader>
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
