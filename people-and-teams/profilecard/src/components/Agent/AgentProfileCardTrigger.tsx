import React from 'react';

import { type ProfileCardTriggerProps } from '../../types';
import ProfileCardTrigger from '../common/ProfileCardTrigger';

import { AgentProfileCardLazy } from './lazyAgentProfileCard';

export const AgentProfileCardTrigger = ({
	trigger = 'hover',
	...props
}: Omit<ProfileCardTriggerProps, 'renderProfileCard'>) => {
	const renderProfileCard = () => {
		return <AgentProfileCardLazy />;
	};

	return <ProfileCardTrigger {...props} renderProfileCard={renderProfileCard} trigger={trigger} />;
};
