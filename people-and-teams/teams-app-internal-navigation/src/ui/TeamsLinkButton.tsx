import React from 'react';

import { LinkButton, type LinkButtonProps } from '@atlaskit/button/new';

import type { NavigationIntentProps } from '../common/utils/getNavigationProps';
import { getNavigationProps } from '../common/utils/getNavigationProps';

import { useTeamsNavigationContext } from './TeamsNavigationProvider';

type BaseLinkButtonProps = Omit<LinkButtonProps, 'target'>;

export type TeamsLinkButtonProps = BaseLinkButtonProps & NavigationIntentProps;

/**
 * Drop-in replacement for an ADS LinkButton that uses the intent-based navigation system to resolve `target` automatically.
 */
export const TeamsLinkButton = (props: TeamsLinkButtonProps) => {
	const { href, onClick, ...rest } = props;
	const context = useTeamsNavigationContext();
	const input =
		props.intent === 'action'
			? {
					href: href as string,
					intent: props.intent,
					previewPanelProps: props.previewPanelProps,
					context,
				}
			: { href: href as string, intent: props.intent, context };
	const navigationProps = getNavigationProps(input);
	const handleClick: typeof onClick = (e, analyticsEvent) => {
		if (onClick) onClick(e, analyticsEvent);
		if (!e.defaultPrevented) navigationProps.onClick?.(e);
	};
	return <LinkButton href={href} target={navigationProps.target} onClick={handleClick} {...rest} />;
};
