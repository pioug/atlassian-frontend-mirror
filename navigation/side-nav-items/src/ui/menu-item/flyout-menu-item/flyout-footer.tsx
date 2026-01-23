/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const footerStyles = cssMap({
	root: {
		borderBlockStartWidth: token('border.width'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border'),
		marginBlockStart: token('space.100'),
		paddingBlockStart: token('space.100'),
	}
});

export interface FlyoutFooterProps {
	/**
	 * The content to display within the flyout footer. Typically used for
	 * supplementary actions or information.
	 */
	children?: React.ReactNode;

	/**
	 * A unique string that appears as data attribute data-testid in the
	 * rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

/**
 * __Flyout menu item footer__
 *
 * The footer section of a flyout menu. This component can display
 * supplementary actions or information at the bottom of the flyout menu. This
 * component should be placed after FlyoutBody within the FlyoutMenuItemContent.
 */
export const FlyoutFooter = (props: FlyoutFooterProps) => {
	const { children, testId } = props;

	return (
		<div data-testid={testId} css={footerStyles.root}>
			{children}
		</div>
	)
};
