/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { jsx } from '@atlaskit/css';
import Modal, { ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';
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

export default (): JSX.Element => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
	const dismiss = () => setIsVisible(false);
	const done = () => setIsVisible(false);

	return (
		<div>
			<Button onClick={() => setIsVisible(true)}>Open modal</Button>
			<ModalTransition>
				{isVisible && (
					<Modal onOpenComplete={() => setIsSpotlightOpen(true)}>
						<ModalHeader>
							<PopoverProvider>
								<PopoverTarget>
									<ModalTitle>Show Spotlight</ModalTitle>
								</PopoverTarget>
								<PopoverContent
									strategy="absolute"
									dismiss={dismiss}
									placement="right-end"
									isVisible={isSpotlightOpen}
								>
									<SpotlightCard testId="spotlight">
										<SpotlightHeader>
											<SpotlightHeadline>Headline</SpotlightHeadline>
											<SpotlightControls>
												<SpotlightDismissControl />
											</SpotlightControls>
										</SpotlightHeader>
										<SpotlightBody>
											<Text>Brief and direct textual content to elaborate on the intent.</Text>
										</SpotlightBody>
										<SpotlightFooter>
											<SpotlightActions>
												<SpotlightPrimaryAction onClick={done}>Done</SpotlightPrimaryAction>
											</SpotlightActions>
										</SpotlightFooter>
									</SpotlightCard>
								</PopoverContent>
							</PopoverProvider>
						</ModalHeader>
					</Modal>
				)}
			</ModalTransition>
		</div>
	);
};
