/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { Flex, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { CloseButton } from './close-button';
import { useModal } from './hooks';

const headerStyles = css({
	display: 'flex',
	position: 'relative',
	alignItems: 'center',
	justifyContent: 'space-between',
	marginBlockEnd: `calc(-1 * ${token('border.width.outline')})`,
	paddingBlockEnd: token('space.200'),
	paddingBlockStart: token('space.300'),
	paddingInline: token('space.300'),
});

const flexStyles = xcss({
	flexDirection: 'row-reverse',
	width: '100%',
});

export interface ModalHeaderProps {
	/**
	 * Children of modal dialog header.
	 */
	children?: React.ReactNode;

	/**
	 * Shows a close button at the end of the header.
	 * @default false
	 */
	hasCloseButton?: boolean;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

/**
 * __Modal header__
 *
 * A modal header contains the title of the modal and can contain other React elements such as a close button.
 *
 * - [Examples](https://atlassian.design/components/modal-dialog/examples#modal-header)
 * - [Code](https://atlassian.design/components/modal-dialog/code#modal-header-props)
 * - [Usage](https://atlassian.design/components/modal-dialog/usage)
 */
const ModalHeader = (props: ModalHeaderProps) => {
	const { children, testId: userDefinedTestId, hasCloseButton = false } = props;
	const { hasProvidedOnClose, onClose, testId: modalTestId } = useModal();

	const testId = userDefinedTestId || (modalTestId && `${modalTestId}--header`);

	// Only show if an onClose was provided for the modal dialog
	const shouldShowCloseButton = hasCloseButton && hasProvidedOnClose && onClose;

	return (
		<div css={headerStyles} data-testid={testId}>
			{shouldShowCloseButton ? (
				// The reason we are putting the close button first in the DOM and then
				// reordering them is to ensure that users of assistive technology get
				// all the context of a modal when initial focus is placed on the close
				// button, since it's the first interactive element.
				<Flex gap="space.200" justifyContent="space-between" xcss={flexStyles}>
					<Flex justifyContent="end">
						<CloseButton onClick={onClose} testId={modalTestId} />
					</Flex>
					<Flex justifyContent="start" alignItems="center">
						{children}
					</Flex>
				</Flex>
			) : (
				children
			)}
		</div>
	);
};

export default ModalHeader;
