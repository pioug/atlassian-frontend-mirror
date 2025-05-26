import React from 'react';

import { ElementName, IconType } from '../../../../../constants';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseBadgeElement, type BaseBadgeElementProps, toBadgeProps } from '../common';

export type VoteCountElementProps = BaseBadgeElementProps;

const VoteCountElement = (props: VoteCountElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();
	const data = context ? toBadgeProps(context.voteCount?.toString()) : null;

	return data ? (
		<BaseBadgeElement icon={IconType.Vote} {...data} {...props} name={ElementName.VoteCount} />
	) : null;
};

export default VoteCountElement;
