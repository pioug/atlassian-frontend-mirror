import React, { useState } from 'react';

import ModalBody from '@atlaskit/modal-dialog/modal-body';
import Modal from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Popup } from '@atlaskit/popup/popup';

type TVariant = 'none' | 'refusing' | 'escape-disabled' | 'closing';

/**
 * Test fixture: Escape must never close these modals natively. `refusing-modal` keeps itself
 * open in `onClose`. `escape-disabled-modal` sets `shouldCloseOnEscapePress={false}`. Each modal
 * has a child popup, a button that removes itself, and a nested modal that closes in `onClose`.
 * `closing-modal` closes in `onClose`, to test Escape during the exit. The `host-popup` opens a modal inside a
 * popup (as Forge does); that modal closes on Escape.
 */
export default function TestingEscapeRefused(): React.ReactNode {
	const [variant, setVariant] = useState<TVariant>('none');
	const [closeCount, setCloseCount] = useState(0);
	const [isChildPopupOpen, setIsChildPopupOpen] = useState(false);
	const [hasRemovableButton, setHasRemovableButton] = useState(true);
	const [isHostPopupOpen, setIsHostPopupOpen] = useState(false);
	const [isHostedModalOpen, setIsHostedModalOpen] = useState(false);
	const [hostPopupCloseCount, setHostPopupCloseCount] = useState(0);
	const [isNestedModalOpen, setIsNestedModalOpen] = useState(false);
	const [nestedCloseCount, setNestedCloseCount] = useState(0);

	return (
		<div>
			<button type="button" data-testid="refusing-trigger" onClick={() => setVariant('refusing')}>
				Open refusing modal
			</button>
			<button
				type="button"
				data-testid="escape-disabled-trigger"
				onClick={() => setVariant('escape-disabled')}
			>
				Open modal with Escape disabled
			</button>
			<button type="button" data-testid="closing-trigger" onClick={() => setVariant('closing')}>
				Open closing modal
			</button>
			<div data-testid="close-count">{closeCount}</div>
			<div data-testid="nested-close-count">{nestedCloseCount}</div>
			<ModalTransition>
				{variant !== 'none' && (
					<Modal
						testId="modal"
						onClose={() => {
							setCloseCount((count) => count + 1);
							if (variant === 'closing') {
								setVariant('none');
							}
						}}
						shouldCloseOnEscapePress={variant !== 'escape-disabled'}
						shouldCloseOnOverlayClick={false}
					>
						<ModalHeader>
							<ModalTitle>Escape refused</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<button type="button" data-testid="modal-body-button">
								Body button
							</button>
							{hasRemovableButton && (
								<button
									type="button"
									data-testid="removable-button"
									onClick={() => setHasRemovableButton(false)}
								>
									Remove me
								</button>
							)}
							<button
								type="button"
								data-testid="nested-modal-trigger"
								onClick={() => setIsNestedModalOpen(true)}
							>
								Open nested modal
							</button>
							<ModalTransition>
								{isNestedModalOpen && (
									<Modal
										testId="nested-modal"
										onClose={() => {
											setNestedCloseCount((count) => count + 1);
											setIsNestedModalOpen(false);
										}}
									>
										<ModalBody>
											<button type="button" data-testid="nested-modal-button">
												Nested modal button
											</button>
										</ModalBody>
									</Modal>
								)}
							</ModalTransition>
							<Popup
								isOpen={isChildPopupOpen}
								onClose={() => setIsChildPopupOpen(false)}
								placement="bottom-start"
								shouldRenderToParent
								content={() => (
									<button type="button" data-testid="child-popup-button">
										In popup
									</button>
								)}
								trigger={(triggerProps) => (
									<button
										{...triggerProps}
										type="button"
										data-testid="child-popup-trigger"
										onClick={() => setIsChildPopupOpen((isOpen) => !isOpen)}
									>
										Open popup
									</button>
								)}
							/>
						</ModalBody>
						<ModalFooter>
							<button type="button" onClick={() => setVariant('none')}>
								Close
							</button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
			<div data-testid="host-popup-close-count">{hostPopupCloseCount}</div>
			<Popup
				isOpen={isHostPopupOpen}
				onClose={() => {
					setHostPopupCloseCount((count) => count + 1);
					setIsHostPopupOpen(false);
				}}
				placement="bottom-start"
				shouldRenderToParent
				content={() => (
					<div data-testid="host-popup-content">
						<button
							type="button"
							data-testid="hosted-modal-trigger"
							onClick={() => setIsHostedModalOpen(true)}
						>
							Open modal
						</button>
						<ModalTransition>
							{isHostedModalOpen && (
								<Modal testId="hosted-modal" onClose={() => setIsHostedModalOpen(false)}>
									<ModalBody>
										<button type="button" data-testid="hosted-modal-button">
											Hosted modal button
										</button>
									</ModalBody>
								</Modal>
							)}
						</ModalTransition>
					</div>
				)}
				trigger={(triggerProps) => (
					<button
						{...triggerProps}
						type="button"
						data-testid="host-popup-trigger"
						onClick={() => setIsHostPopupOpen((isOpen) => !isOpen)}
					>
						Open host popup
					</button>
				)}
			/>
		</div>
	);
}
