import React from 'react';

import { Anchor, type AnchorProps } from '@atlaskit/primitives/compiled';

import type { NavigationIntentProps } from '../common/utils/getNavigationProps';
import { getNavigationProps } from '../common/utils/getNavigationProps';
import { buildNavigationInput } from '../common/utils/utils';

import { useTeamsNavigationContext } from './TeamsNavigationProvider';

type BaseAnchorProps = Omit<AnchorProps, 'target' | 'rel'>;

export type TeamsAnchorProps = BaseAnchorProps & NavigationIntentProps;

/**
 * Drop-in replacement for an ADS Anchor that uses the intent-based navigation system to resolve `target` and `rel` automatically.
 */
export const TeamsAnchor = (props: TeamsAnchorProps): React.JSX.Element => {
	const { href, onClick, ...rest } = props;
	const context = useTeamsNavigationContext();
	const input = buildNavigationInput({
		...props,
		href: href ?? '',
		context,
		onBeforeNavigate: onClick,
	});
	const navigationProps = getNavigationProps(input);

	return <Anchor {...rest} {...navigationProps} />;
};
