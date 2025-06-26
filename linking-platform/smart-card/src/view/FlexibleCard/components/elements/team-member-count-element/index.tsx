import React from 'react';

import { ElementName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { BaseTextElement, type BaseTextElementProps, toFormattedTextProps } from '../common';

export type TeamMemberCountElementProps = BaseTextElementProps;
const MAX_TEAM_MEMBER_LIMIT = 50;

const TeamMemberCountElement = (props: TeamMemberCountElementProps): JSX.Element | null => {
	const context = useFlexibleUiContext();

	if (!context?.teamMemberCount) {
		return null;
	}

	const count =
		context?.teamMemberCount && context?.teamMemberCount > MAX_TEAM_MEMBER_LIMIT
			? `${MAX_TEAM_MEMBER_LIMIT}+`
			: context?.teamMemberCount?.toString();
	const data = count ? toFormattedTextProps(messages.team_members_count, count) : null;

	return data ? <BaseTextElement {...data} {...props} name={ElementName.TeamMemberCount} /> : null;
};

export default TeamMemberCountElement;
