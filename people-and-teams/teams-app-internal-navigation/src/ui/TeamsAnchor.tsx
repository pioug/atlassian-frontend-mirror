import React from 'react';

import { Anchor, type AnchorProps } from '@atlaskit/primitives/compiled';

import type { NavigationIntent, previewPanelProps } from '../common/utils/getNavigationProps';
import { getNavigationProps } from '../common/utils/getNavigationProps';

import { useTeamsNavigationContext } from './TeamsNavigationProvider';

export type TeamsAnchorProps = Omit<AnchorProps, 'target' | 'rel'> & {
	intent: NavigationIntent;
	previewPanelProps?: previewPanelProps;
};

/**
 * Drop-in replacement for an ADS Anchor that uses the intent-based navigation system to resolve `target` and `rel` automatically.
 */
export const TeamsAnchor = (
	{ href, intent, previewPanelProps, ...rest }: TeamsAnchorProps
) => {
	const context = useTeamsNavigationContext();
	const { target, rel } = getNavigationProps({ href, intent, previewPanelProps, context });
	return <Anchor href={href} target={target} rel={rel} {...rest} />;
};