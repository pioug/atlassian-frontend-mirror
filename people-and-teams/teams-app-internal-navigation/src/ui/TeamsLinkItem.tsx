import React from 'react';

import LinkItem from '@atlaskit/menu/link-item';
import type { LinkItemProps } from '@atlaskit/menu/types';

import { buildNavigationInput } from '../common/utils/buildNavigationInput';
import type { NavigationIntentProps } from '../common/utils/getNavigationProps';
import { getNavigationProps } from '../common/utils/getNavigationProps';
import { useTeamsNavigationContext } from './useTeamsNavigationContext';

type BaseLinkItemProps = Omit<LinkItemProps, 'target' | 'rel'>;

export type TeamsLinkItemProps = BaseLinkItemProps & NavigationIntentProps;

/**
 * Drop-in replacement for an ADS LinkItem that uses the intent-based navigation system to resolve `target` and `rel` automatically.
 */
export const TeamsLinkItem = (props: TeamsLinkItemProps): React.JSX.Element => {
	const { href, onClick, children, ...rest } = props;
	const context = useTeamsNavigationContext();
	const input = buildNavigationInput({
		...props,
		href: href ?? '',
		context,
		onBeforeNavigate: onClick,
	});
	const { onClick: composedOnClick, href: resolvedHref, target, rel } = getNavigationProps(input);

	return (
		<LinkItem {...rest} href={resolvedHref} target={target} rel={rel} onClick={composedOnClick}>
			{children}
		</LinkItem>
	);
};
