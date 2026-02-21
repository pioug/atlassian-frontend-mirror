/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const bodyStyles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
		overflowY: 'auto',
		height: '100%',
		justifyContent: 'start',
		marginInlineStart: token('space.negative.100'),
		marginInlineEnd: token('space.negative.100'),
		marginBlockEnd: token('space.negative.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
	},
});

export interface FlyoutBodyProps {
	/**
	 * The content to display within the main body of the flyout menu.
	 * Typically includes the primary interactive elements.
	 */
	children?: React.ReactNode;

	/**
	 * Handler for blur capture events.
	 */
	onBlurCapture?: React.FocusEventHandler<HTMLObjectElement>;

	/**
	 * Handler for key down events.
	 */
	onKeyDown?: React.KeyboardEventHandler<HTMLObjectElement>;

	/**
	 * Handler for key up events.
	 */
	onKeyUp?: React.KeyboardEventHandler<HTMLObjectElement>;

	/**
	 * A unique string that appears as data attribute data-testid in the
	 * rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

/**
 * __Flyout menu item body__
 *
 * The main section of a flyout menu. This component is used to render the
 * primary contents of the flyout menu. This component should be placed between
 * FlyoutHeader and FlyoutFooter (if present), as is scrollable if the content
 * exceeds the available space.
 */
export const FlyoutBody = React.forwardRef<HTMLDivElement, FlyoutBodyProps>((props, ref) => {
	const { children, testId, onKeyDown, onKeyUp, onBlurCapture } = props;

	return (
		// The presentation role is used to satisfy the
		// eslint-plugin-jsx-a11y/no-noninteractive-element-interactions
		// linting rule. The event handlers (onKeyDown, onKeyUp, onBlurCapture)
		// are here to capture bubbled events from child elements, not to make
		// this div itself interactive.
		<div
			ref={ref}
			css={bodyStyles.root}
			data-testid={testId}
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
			onBlurCapture={onBlurCapture}
			role="presentation"
		>
			{children}
		</div>
	);
});
