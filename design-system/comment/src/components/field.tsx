/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type FC, type ReactNode } from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { cssMap, cx, jsx } from '@atlaskit/css';
import { Anchor } from '@atlaskit/primitives/compiled';
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

const textStyles = cssMap({
	root: {
		color: token('color.text.subtle'),
	},
});

const anchorStyles = cssMap({
	root: {
		textDecoration: 'none',

		'&:hover': {
			color: token('color.link'),
			textDecoration: 'underline',
		},
		'&:active': {
			color: token('color.link.pressed'),
			textDecoration: 'none',
		},
	},
});

const noAuthorStyles = cssMap({
	root: {
		fontWeight: 'inherit',
	},
});
const hasAuthorStyles = cssMap({
	root: {
		fontWeight: token('font.weight.medium'),
	},
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
			xcss={cx(
				textStyles.root,
				anchorStyles.root,
				hasAuthor ? hasAuthorStyles.root : noAuthorStyles.root,
			)}
			onClick={onClick}
			onFocus={onFocus}
			onMouseOver={onMouseOver}
			testId={testId}
		>
			{children}
		</Anchor>
	) : (
		<span
			css={[textStyles.root, hasAuthor ? hasAuthorStyles.root : noAuthorStyles.root]}
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
			data-testid={testId}
		>
			{children}
		</span>
	);
};

export default Field;
