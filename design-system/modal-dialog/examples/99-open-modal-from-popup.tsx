import React, { useCallback, useState } from 'react';

import { createHook, createStore } from 'react-sweet-state';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import Popup from '@atlaskit/popup';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const Store = createStore({
	// value of the store on initialisation
	initialState: {
		focused: false,
	},
	// actions that trigger store mutation
	actions: {
		setFocused:
			(focused) =>
			({ setState }) => {
				// mutate state synchronously
				setState({
					focused: focused,
				});
			},
	},
});

export const useIsFocused = createHook(Store);

const contentStyles = cssMap({
	root: {
		paddingBlockEnd: token('space.200'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

const PopupDefaultExample = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = useCallback(() => setIsModalOpen(true), []);
	const closeModal = useCallback(() => setIsModalOpen(false), []);

	return (
		<Box>
			<Popup
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement="bottom-start"
				content={() => (
					<Box>
						<Box xcss={contentStyles.root}>Contents of Popup</Box>
						<Button
							appearance="primary"
							onClick={() => {
								openModal();
								setIsOpen(false);
							}}
						>
							Open modal - inside Popup
						</Button>
					</Box>
				)}
				trigger={(triggerProps) => (
					<Button
						{...triggerProps}
						appearance="primary"
						isSelected={isOpen}
						onClick={() => {
							setIsOpen(!isOpen);
						}}
					>
						{isOpen ? 'Close' : 'Open'} popup{' '}
					</Button>
				)}
			/>
			<Button appearance="primary" onClick={openModal}>
				Open modal - outside popup
			</Button>
			<ModalTransition>
				{isModalOpen && (
					<Modal onClose={closeModal}>
						<ModalHeader hasCloseButton>
							<ModalTitle>Duplicate this page</ModalTitle>
						</ModalHeader>
						<ModalBody>
							Duplicating this page will make it a child page of{' '}
							<Text weight="bold">Search - user exploration</Text>, in the{' '}
							<Text weight="bold">Search & Smarts</Text> space.
						</ModalBody>
						<ModalFooter>
							<Button appearance="subtle" onClick={closeModal}>
								Cancel
							</Button>
							<Button appearance="primary" onClick={closeModal}>
								Duplicate
							</Button>
						</ModalFooter>
					</Modal>
				)}
			</ModalTransition>
		</Box>
	);
};

const Card = () => {
	const [state, { setFocused }] = useIsFocused();

	const handleOnBlur = (e: any) => {
		setFocused(false);
	};

	const handleOnFocus = (e: any) => {
		setFocused(true);
	};

	return (
		<Box onFocus={handleOnFocus} onBlur={handleOnBlur}>
			<Heading size="medium">
				This is for testing purposes only and is not a recommended design pattern.
			</Heading>
			<Box>{state.focused ? 'focused' : 'unfocused'}</Box>
			<PopupDefaultExample />
		</Box>
	);
};

export default Card;
