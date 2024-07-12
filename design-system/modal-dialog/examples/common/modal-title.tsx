import React from 'react';

import { type ButtonProps, IconButton } from '@atlaskit/button/new';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { Flex, Grid, xcss } from '@atlaskit/primitives';

const gridStyles = xcss({
	width: '100%',
});

const closeContainerStyles = xcss({
	gridArea: 'close',
});

const titleContainerStyles = xcss({
	gridArea: 'title',
});

export interface ModalTitleWithCloseProps {
	/**
	 * Children of modal dialog footer.
	 */
	children: React.ReactNode;

	onClose: ButtonProps['onClick'];
}

export const ModalTitleWithClose = (props: ModalTitleWithCloseProps) => {
	const { children, onClose } = props;

	return (
		<Grid gap="space.200" templateAreas={['title close']} xcss={gridStyles}>
			<Flex xcss={closeContainerStyles} justifyContent="end">
				<IconButton
					testId="modal-close"
					appearance="subtle"
					icon={CrossIcon}
					label="Close Modal"
					onClick={onClose}
				/>
			</Flex>
			<Flex xcss={titleContainerStyles} justifyContent="start">
				{children}
			</Flex>
		</Grid>
	);
};

export default ModalTitleWithClose;
