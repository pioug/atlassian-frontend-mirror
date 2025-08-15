/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import type { AuditLogEventData } from '../../../../../../common/types';
import { DetailRow } from '../../../../../../common/utils/components/detail-row';
import { DetailsSubSection } from '../../../../../../common/utils/components/details-sub-section';

import { ActorName } from './actor/actor-name';
import { UserProfileLink } from './actor/user-profile-link';

interface ActorSectionProps {
	event: AuditLogEventData | undefined;
}

export const ActorSection = ({ event }: ActorSectionProps) => {
	const actor = event?.attributes.actor;
	if (!actor) {
		return null;
	}

	return (
		<DetailsSubSection event={event} title="Actor">
			<DetailRow label="Name" value={<ActorName actor={actor} />} />
			<DetailRow label="Email" value={actor.email} />
			<DetailRow label="Account ID" value={actor.id} />
			<DetailRow label="User Profile" value={<UserProfileLink actor={actor} />} />
		</DetailsSubSection>
	);
};
