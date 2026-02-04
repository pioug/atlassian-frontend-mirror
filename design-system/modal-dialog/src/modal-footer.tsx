/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { useModal } from './hooks';

const footerStyles = css({
	display: 'flex',
	position: 'relative',
	alignItems: 'center',
	justifyContent: 'flex-end',
	gap: token('space.100', '8px'),
	marginBlockStart: token('space.negative.025'),
	paddingBlockEnd: token('space.300'),
	paddingBlockStart: token('space.200'),
	paddingInline: token('space.300'),
});

export interface ModalFooterProps {
	/**
	 * Children of modal dialog footer.
	 */
	children?: ReactNode;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

/**
 * __Modal footer__
 *
 * A modal footer often contains a primary action and the ability to cancel and close the dialog, though can contain any React element.
 *
 * - [Examples](https://atlassian.design/components/modal-dialog/examples#modal-footer)
 * - [Code](https://atlassian.design/components/modal-dialog/code#modal-footer-props)
 * - [Usage](https://atlassian.design/components/modal-dialog/usage)
 */
const ModalFooter = (props: ModalFooterProps): JSX.Element => {
	const { children, testId: userDefinedTestId } = props;
	const { testId: modalTestId } = useModal();

	const testId = userDefinedTestId || (modalTestId && `${modalTestId}--footer`);

	return (
		<div css={footerStyles} data-testid={testId}>
			{children}
		</div>
	);
};

export default ModalFooter;
