/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Avatar from '@atlaskit/avatar';
import Button, { IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import InlineDialog from '@atlaskit/inline-dialog';
import Modal, {
	ModalBody,
	ModalHeader,
	ModalTitle,
	ModalTransition,
	useModal,
} from '@atlaskit/modal-dialog';
import { Box, Flex, Grid, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const footerStyles = xcss({
	display: 'flex',
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

const gridStyles = xcss({
	width: '100%',
});

const closeContainerStyles = xcss({
	gridArea: 'close',
});

const titleContainerStyles = xcss({
	gridArea: 'title',
});

const CustomFooter = () => {
	const [isHintOpen, setIsHintOpen] = useState(false);
	const openHint = useCallback(() => setIsHintOpen(true), []);
	const closeHint = useCallback(() => setIsHintOpen(false), []);

	const { onClose } = useModal();

	return (
		<Box xcss={footerStyles} padding="space.300">
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
		</Box>
	);
};

export default function Example() {
	const [isOpen, setIsOpen] = useState(false);
	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	return (
		<Fragment>
			<Button aria-haspopup="dialog" appearance="primary" onClick={openModal}>
				Open modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<Modal onClose={closeModal}>
						<ModalHeader>
							<Grid gap="space.200" templateAreas={['title close']} xcss={gridStyles}>
								<Flex xcss={closeContainerStyles} justifyContent="end">
									<IconButton
										appearance="subtle"
										icon={CrossIcon}
										label="Close Modal"
										onClick={closeModal}
									/>
								</Flex>
								<Flex xcss={titleContainerStyles} justifyContent="start">
									<ModalTitle>Custom modal footer</ModalTitle>
								</Flex>
							</Grid>
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
		</Fragment>
	);
}
