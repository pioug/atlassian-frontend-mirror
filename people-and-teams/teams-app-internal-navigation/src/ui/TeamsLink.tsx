import React from 'react';

import Link, { type LinkProps } from '@atlaskit/link';

import type { NavigationIntentProps } from '../common/utils/getNavigationProps';
import { getNavigationProps } from '../common/utils/getNavigationProps';
import { buildNavigationInput } from '../common/utils/utils';

import { useTeamsNavigationContext } from './TeamsNavigationProvider';

type BaseLinkProps = Omit<LinkProps, 'target'>;

export type TeamsLinkProps = BaseLinkProps & NavigationIntentProps;

/**
 * Drop-in replacement for an ADS Link that uses the intent-based navigation system to resolve `target` automatically.
 */
export const TeamsLink = (props: TeamsLinkProps) => {
	const { href, onClick, children, ...rest } = props;
	const context = useTeamsNavigationContext();
	const input = buildNavigationInput({ ...props, href: href ?? '', context, onBeforeNavigate: onClick });
	const { onClick: composedOnClick, href: resolvedHref, target, rel } = getNavigationProps(input);

	return (
		<Link {...rest} href={resolvedHref} target={target} rel={rel} onClick={composedOnClick}>
			{children}
		</Link>
	);
};
