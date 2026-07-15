/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { jsx } from '@atlaskit/css';
import Modal, { ModalHeader, ModalTitle, ModalTransition } from '@atlaskit/modal-dialog';
import { Text } from '@atlaskit/primitives/compiled';
import { SpotlightActions } from '@atlaskit/spotlight/actions';
import { SpotlightBody } from '@atlaskit/spotlight/body';
import { SpotlightCard } from '@atlaskit/spotlight/card';
import { SpotlightControls } from '@atlaskit/spotlight/controls';
import { SpotlightDismissControl } from '@atlaskit/spotlight/dismiss-control';
import { SpotlightFooter } from '@atlaskit/spotlight/footer';
import { SpotlightHeader } from '@atlaskit/spotlight/header';
import { SpotlightHeadline } from '@atlaskit/spotlight/headline';
import { PopoverContent } from '@atlaskit/spotlight/popover-content';
import { PopoverProvider } from '@atlaskit/spotlight/popover-provider';
import { PopoverTarget } from '@atlaskit/spotlight/popover-target';
import { SpotlightPrimaryAction } from '@atlaskit/spotlight/primary-action';

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
