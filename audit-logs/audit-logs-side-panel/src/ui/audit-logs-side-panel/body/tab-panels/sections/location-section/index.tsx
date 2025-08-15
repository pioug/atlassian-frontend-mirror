/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import type { AuditLogEventData } from '../../../../../../common/types';
import { DetailRow } from '../../../../../../common/utils/components/detail-row';
import { DetailsSubSection } from '../../../../../../common/utils/components/details-sub-section';

interface LocationSectionProps {
	event: AuditLogEventData | undefined;
}

export const LocationSection = ({ event }: LocationSectionProps) => {
	const location = event?.attributes.location;
	if (!location) {
		return null;
	}

	return (
		<DetailsSubSection event={event} title="Location">
			<DetailRow label="City" value={location.city} />
			<DetailRow label="IP Address" value={location.ip} />
		</DetailsSubSection>
	);
};
