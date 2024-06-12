/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/new';
import InlineDialog from '@atlaskit/inline-dialog';
import { token } from '@atlaskit/tokens';

import Modal, { ModalBody, ModalHeader, ModalTitle, ModalTransition, useModal } from '../../src';

const footerStyles = css({
	display: 'flex',
	padding: token('space.300', '24px'),
	alignItems: 'center',
	justifyContent: 'space-between',
});

const wrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	color: token('color.text.subtlest'),
	cursor: 'help',
});

const marginLeftStyles = css({ marginInlineStart: token('space.200', '16px') });

const CustomFooter = () => {
	const [isHintOpen, setIsHintOpen] = useState(false);
	const openHint = useCallback(() => setIsHintOpen(true), []);
	const closeHint = useCallback(() => setIsHintOpen(false), []);

	const { onClose } = useModal();

	return (
		<div css={footerStyles}>
			<InlineDialog content="Some hint text?" isOpen={isHintOpen} placement="top-start">
				<span
					role="presentation"
					css={wrapperStyles}
					onMouseEnter={openHint}
					onMouseLeave={closeHint}
				>
					<Avatar size="small" />
					<span css={marginLeftStyles}>Hover Me!</span>
				</span>
			</InlineDialog>
			<Button appearance="primary" onClick={onClose}>
				Close
			</Button>
		</div>
	);
};

export default function Example() {
	const [isOpen, setIsOpen] = useState(false);
	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	return (
		<div>
			<Button appearance="primary" onClick={openModal}>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal}>
						<ModalHeader>
							<ModalTitle>Custom modal footer</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<p>
								If you wish to customise a modal dialog, it accepts any valid React element as
								children.
							</p>

							<p>
								Modal header accepts any valid React element as children, so you can use modal title
								in conjunction with other elements like an exit button in the top right.
							</p>

							<p>
								Modal footer accepts any valid React element as children. For example, you can add
								an avatar in the footer. For very custom use cases, you can achieve the same thing
								without modal footer.
							</p>
						</ModalBody>
						<CustomFooter />
					</Modal>
				)}
			</ModalTransition>
		</div>
	);
}
