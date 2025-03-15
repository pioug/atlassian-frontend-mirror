import React from 'react';

import { CloseButton, OnCloseHandler } from '@atlaskit/modal-dialog';
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

	onClose: OnCloseHandler;

	testId?: string;
}

export const ModalTitleWithClose = (props: ModalTitleWithCloseProps) => {
	const { children, onClose, testId = 'modal' } = props;

	return (
		<Grid gap="space.200" templateAreas={['title close']} xcss={gridStyles}>
			<Flex xcss={titleContainerStyles} justifyContent="start">
				{children}
			</Flex>
			<Flex xcss={closeContainerStyles} justifyContent="end">
				<CloseButton onClick={onClose} testId={testId} />
			</Flex>
		</Grid>
	);
};

export default ModalTitleWithClose;
