import React from 'react';

import Link, { type LinkProps } from '@atlaskit/link';

import type { NavigationIntentProps } from '../common/utils/getNavigationProps';
import { getNavigationProps } from '../common/utils/getNavigationProps';

import { useTeamsNavigationContext } from './TeamsNavigationProvider';

type BaseLinkProps = Omit<LinkProps, 'target'>;

export type TeamsLinkProps = BaseLinkProps & NavigationIntentProps;

/**
 * Drop-in replacement for an ADS Link that uses the intent-based navigation system to resolve `target` automatically.
 */
export const TeamsLink = (props: TeamsLinkProps) => {
	const { href, onClick, children, ...rest } = props;
	const context = useTeamsNavigationContext();
	const input =
		props.intent === 'action'
			? { href, intent: props.intent, previewPanelProps: props.previewPanelProps, context }
			: { href, intent: props.intent, context };
	const navigationProps = getNavigationProps(input);
	const handleClick: typeof onClick = (e, analyticsEvent) => {
		if (onClick) onClick(e, analyticsEvent);
		if (!e.defaultPrevented) navigationProps.onClick?.(e);
	};
	return (
		<Link href={href} target={navigationProps.target} onClick={handleClick} {...rest}>
			{children}
		</Link>
	);
};
