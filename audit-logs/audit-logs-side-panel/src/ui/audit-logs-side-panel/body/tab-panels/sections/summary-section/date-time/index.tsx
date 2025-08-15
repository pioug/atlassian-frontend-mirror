/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import { FormattedDate, FormattedTime } from 'react-intl-next';

import { Inline } from '@atlaskit/primitives/compiled';

interface EventDateTimeProps {
	time: string;
}

export const EventDateTime = ({ time }: EventDateTimeProps) => (
	<Inline role="row" testId="audit-log-side-panel-event-date-time">
		<FormattedDate value={time} year="numeric" month="short" day="2-digit" />{' '}
		<FormattedTime
			value={time}
			hourCycle="h23"
			hour="numeric"
			minute="numeric"
			timeZoneName="short"
		/>
	</Inline>
);
