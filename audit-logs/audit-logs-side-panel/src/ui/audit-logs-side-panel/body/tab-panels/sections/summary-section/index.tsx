/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import type { AuditLogEventData } from '../../../../../../common/types';
import { DetailRow } from '../../../../../../common/utils/components/detail-row';
import { DetailsSubSection } from '../../../../../../common/utils/components/details-sub-section';

import { CopyJsonButton } from './copy-button';
import { EventDateTime } from './date-time';

interface SummarySectionProps {
	event: AuditLogEventData | undefined;
	eventJSON: string;
}

export const SummarySection = ({ event, eventJSON }: SummarySectionProps) => {
	if (!event) {
		return null;
	}

	return (
		<DetailsSubSection event={event} title="Summary">
			<DetailRow label="Activity" value={event.message} />
			<DetailRow label="Action" value={event.attributes.action} />
			<DetailRow label="Type" value={event.type} />
			<DetailRow label="Activity ID" value={event.id} />
			<DetailRow label="Date" value={<EventDateTime time={event.attributes.time} />} />
			<DetailRow label="JSON" value={<CopyJsonButton eventId={event.id} eventJSON={eventJSON} />} />
		</DetailsSubSection>
	);
};
