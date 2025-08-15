/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { Stack } from '@atlaskit/primitives/compiled';

import type { AuditLogEventData } from '../../../../common/types';

import { ActorSection } from './sections/actor-section';
import { LocationSection } from './sections/location-section';
import { SummarySection } from './sections/summary-section';

export interface DetailsPanelProps {
	event: AuditLogEventData | undefined;
	eventJSON: string;
}

export const DetailsPanel = ({ event, eventJSON }: DetailsPanelProps) => {
	return (
		<Stack space="space.300" grow="fill">
			<SummarySection event={event} eventJSON={eventJSON} />
			<ActorSection event={event} />
			<LocationSection event={event} />
		</Stack>
	);
};
