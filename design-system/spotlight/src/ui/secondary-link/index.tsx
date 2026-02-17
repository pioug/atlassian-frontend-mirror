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
		textDecoration: 'none',
		paddingInline: token('space.075'),
		paddingBlock: token('space.025'),
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

export interface SpotlightSecondaryLinkProps {
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
 * __Spotlight secondary link__
 *
 * `SpotlightSecondaryLink` is a link-styled secondary control that mirrors the appearance of `SpotlightSecondaryAction`.
 * Use it when the secondary control should navigate to a URL instead of performing an action (e.g. "Learn more", "View docs").
 *
 */
export const SpotlightSecondaryLink: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightSecondaryLinkProps> & React.RefAttributes<HTMLAnchorElement>
> = forwardRef<HTMLAnchorElement, SpotlightSecondaryLinkProps>(
	(
		{
			'aria-label': ariaLabel,
			onClick,
			children,
			testId,
			href,
			target,
			rel,
		}: SpotlightSecondaryLinkProps,
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
			componentName="SpotlightSecondaryLink"
		>
			<Text as="span">{children}</Text>
		</Anchor>
	),
);
