import React, { forwardRef } from 'react';

import { Anchor, type AnchorProps } from '@atlaskit/primitives/compiled/anchor';

import { buildNavigationInput } from '../common/utils/buildNavigationInput';
import type { NavigationIntentProps } from '../common/utils/getNavigationProps';
import { getNavigationProps } from '../common/utils/getNavigationProps';
import { useTeamsNavigationContext } from './useTeamsNavigationContext';

type BaseAnchorProps = Omit<AnchorProps, 'target' | 'rel'>;

export type TeamsAnchorProps = BaseAnchorProps & NavigationIntentProps;

/**
 * Drop-in replacement for an ADS Anchor that uses the intent-based navigation system to resolve `target` and `rel` automatically.
 */
export const TeamsAnchor: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<TeamsAnchorProps> & React.RefAttributes<HTMLAnchorElement>
> = forwardRef<HTMLAnchorElement, TeamsAnchorProps>((props, ref) => {
	const { href, onClick, ...rest } = props;
	const context = useTeamsNavigationContext();
	const input = buildNavigationInput({
		...props,
		href: href ?? '',
		context,
		onBeforeNavigate: onClick,
	});
	const navigationProps = getNavigationProps(input);

	return <Anchor {...rest} {...navigationProps} ref={ref} />;
});

TeamsAnchor.displayName = 'TeamsAnchor';
