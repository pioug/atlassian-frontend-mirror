/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Anchor, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		boxSizing: 'border-box',
		display: 'flex',
		alignItems: 'center',
		color: token('color.text.inverse'),
		borderRadius: token('radius.small'),
		backgroundColor: token('color.background.neutral.bold'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.accent.gray'),
		textDecoration: 'none',
		paddingInline: token('space.075'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.bold.hovered'),
			textDecoration: 'none',
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.bold.pressed'),
			textDecoration: 'none',
		},
	},
});

export interface SpotlightPrimaryLinkProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * Text to be rendered inside the link.
	 */
	children: ReactNode;

	/**
	 * The destination URL. Accepts a URL string, or a router config object when using AppProvider's router link.
	 */
	href: string;

	/**
	 * Target attribute for the link (e.g. `_blank`).
	 */
	target?: React.AnchorHTMLAttributes<HTMLAnchorElement>['target'];

	/**
	 * Rel attribute for the link (e.g. `noopener noreferrer` for `target="_blank"`).
	 */
	rel?: string;

	/**
	 * Handler called when the link is clicked. The second argument provides an Atlaskit UI analytics event when using Anchor.
	 */
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;

	/**
	 * An accessible label to read out in the event that the displayed text does not provide enough context.
	 */
	'aria-label'?: string;
}

/**
 * __Spotlight primary link__
 *
 * `SpotlightPrimaryLink` is a link-styled primary control that mirrors the appearance of `SpotlightPrimaryAction`.
 * Use it when the primary control should navigate to a URL instead of performing an action (e.g. "Get started", "View guide").
 *
 */
export const SpotlightPrimaryLink: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightPrimaryLinkProps> & React.RefAttributes<HTMLAnchorElement>
> = forwardRef<HTMLAnchorElement, SpotlightPrimaryLinkProps>(
	(
		{
			'aria-label': ariaLabel,
			onClick,
			children,
			testId,
			href,
			target,
			rel,
		}: SpotlightPrimaryLinkProps,
		ref,
	) => (
		<Anchor
			aria-label={ariaLabel}
			ref={ref}
			testId={testId}
			xcss={styles.root}
			href={href}
			target={target}
			rel={rel}
			onClick={onClick ? (e, _analyticsEvent) => onClick(e) : undefined}
			componentName="SpotlightPrimaryLink"
		>
			<Text as="span">{children}</Text>
		</Anchor>
	),
);
