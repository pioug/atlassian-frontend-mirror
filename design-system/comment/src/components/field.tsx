import React, { type FC, type ReactNode } from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Box, xcss } from '@atlaskit/primitives';
import Anchor from '@atlaskit/primitives/anchor';
import { token } from '@atlaskit/tokens';

export interface CommentFieldProps {
	hasAuthor?: boolean;
	children?: ReactNode;
	href?: string;
	onClick?: (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		analyticsEvent?: UIAnalyticsEvent,
	) => void;
	onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
	onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	testId?: string;
}

const textStyles = xcss({
	color: 'color.text.subtle',
});

const anchorStyles = xcss({
	textDecoration: 'none',

	':hover': {
		color: 'color.link',
		textDecoration: 'underline',
	},
	':active': {
		color: 'color.link.pressed',
		textDecoration: 'none',
	},
});

const noAuthorStyles = xcss({
	fontWeight: 'inherit',
});
const hasAuthorStyles = xcss({
	fontWeight: token('font.weight.medium', '500'),
});

/**
 * __Field__
 *
 * A field appears in the comment header to add metadata to the comment.
 *
 * @internal
 */
const Field: FC<CommentFieldProps> = ({
	children,
	hasAuthor,
	href,
	onClick,
	onFocus,
	onMouseOver,
	testId,
}) => {
	return href ? (
		<Anchor
			href={href}
			xcss={[textStyles, anchorStyles, hasAuthor ? hasAuthorStyles : noAuthorStyles]}
			onClick={onClick}
			onFocus={onFocus}
			onMouseOver={onMouseOver}
			testId={testId}
		>
			{children}
		</Anchor>
	) : (
		<Box
			as="span"
			xcss={[textStyles, hasAuthor ? hasAuthorStyles : noAuthorStyles]}
			/**
			 * It is not normally acceptable to add key handlers to non-interactive elements
			 * as this is an accessibility anti-pattern. However, because this instance is
			 * to add support for analytics instead of creating an inaccessible
			 * custom element, we can add role="presentation" so that there are no negative
			 * impacts to assistive technologies.
			 */
			role="presentation"
			onClick={onClick}
			onFocus={onFocus}
			onMouseOver={onMouseOver}
			testId={testId}
		>
			{children}
		</Box>
	);
};

export default Field;
