import React from 'react';

import { LinkButton, type LinkButtonProps } from '@atlaskit/button/new';

import type { NavigationIntentProps } from '../common/utils/getNavigationProps';
import { getNavigationProps } from '../common/utils/getNavigationProps';
import { buildNavigationInput } from '../common/utils/utils';

import { useTeamsNavigationContext } from './TeamsNavigationProvider';

type BaseLinkButtonProps = Omit<LinkButtonProps, 'target'>;

export type TeamsLinkButtonProps = BaseLinkButtonProps & NavigationIntentProps;

/**
 * Drop-in replacement for an ADS LinkButton that uses the intent-based navigation system to resolve `target` automatically.
 */
export const TeamsLinkButton = (props: TeamsLinkButtonProps) => {
	const { href, onClick, ...rest } = props;
	const context = useTeamsNavigationContext();
	const input = buildNavigationInput({
		...props,
		href: href ?? '',
		context,
		onBeforeNavigate: onClick,
	});
	const navigationProps = getNavigationProps(input);

	return <LinkButton {...rest} {...navigationProps} />;
};
