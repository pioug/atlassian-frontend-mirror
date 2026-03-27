import React from 'react';

import { Anchor, type AnchorProps } from '@atlaskit/primitives/compiled';

import type { NavigationIntentProps } from '../common/utils/getNavigationProps';
import { getNavigationProps } from '../common/utils/getNavigationProps';

import { useTeamsNavigationContext } from './TeamsNavigationProvider';

type BaseAnchorProps = Omit<AnchorProps, 'target' | 'rel'>;

export type TeamsAnchorProps = BaseAnchorProps & NavigationIntentProps;

/**
 * Drop-in replacement for an ADS Anchor that uses the intent-based navigation system to resolve `target` and `rel` automatically.
 */
export const TeamsAnchor = (props: TeamsAnchorProps) => {
	const { href, onClick, ...rest } = props;
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
		<Anchor
			href={navigationProps.href}
			target={navigationProps.target}
			rel={navigationProps.rel}
			onClick={handleClick}
			{...rest}
		/>
	);
};
