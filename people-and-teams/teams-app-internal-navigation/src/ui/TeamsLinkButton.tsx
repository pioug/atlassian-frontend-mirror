import React from 'react';

import LinkButton, { type LinkButtonProps } from '@atlaskit/button/link';

import { buildNavigationInput } from '../common/utils/buildNavigationInput';
import type { NavigationIntentProps } from '../common/utils/getNavigationProps';
import { getNavigationProps } from '../common/utils/getNavigationProps';

import { useTeamsNavigationContext } from './useTeamsNavigationContext';

type BaseLinkButtonProps = Omit<LinkButtonProps, 'target'>;

export type TeamsLinkButtonProps = BaseLinkButtonProps & NavigationIntentProps;

/**
 * Drop-in replacement for an ADS LinkButton that uses the intent-based navigation system to resolve `target` automatically.
 */
export const TeamsLinkButton = (props: TeamsLinkButtonProps): React.JSX.Element => {
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
