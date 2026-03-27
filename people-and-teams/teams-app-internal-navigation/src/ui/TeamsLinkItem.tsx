import React from 'react';

import { LinkItem, type LinkItemProps } from '@atlaskit/menu';

import type { NavigationIntentProps } from '../common/utils/getNavigationProps';
import { getNavigationProps } from '../common/utils/getNavigationProps';

import { useTeamsNavigationContext } from './TeamsNavigationProvider';

type BaseLinkItemProps = Omit<LinkItemProps, 'target' | 'rel'>;

export type TeamsLinkItemProps = BaseLinkItemProps & NavigationIntentProps;

/**
 * Drop-in replacement for an ADS LinkItem that uses the intent-based navigation system to resolve `target` and `rel` automatically.
 */
export const TeamsLinkItem = (props: TeamsLinkItemProps) => {
	const { href, onClick, children, ...rest } = props;
	const context = useTeamsNavigationContext();
	const input =
		props.intent === 'action'
			? {
					href: href ?? '',
					intent: props.intent,
					previewPanelProps: props.previewPanelProps,
					context,
				}
			: { href: href ?? '', intent: props.intent, context };
	const navigationProps = getNavigationProps(input);
	const handleClick: typeof onClick = (e) => {
		if (onClick) onClick(e);
		if (!e.defaultPrevented) navigationProps.onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
	};
	return (
		<LinkItem
			href={href}
			target={navigationProps.target}
			rel={navigationProps.rel}
			onClick={handleClick}
			{...rest}
		>
			{children}
		</LinkItem>
	);
};
