import React, { useEffect, useState } from 'react';

import { FormattedDate, FormattedMessage, FormattedRelativeTime } from 'react-intl';

import { messages } from './messages';

const SECONDS_IN_MIN = 60;
const SECONDS_IN_HR = SECONDS_IN_MIN * 60;
const SECONDS_IN_DAY = SECONDS_IN_HR * 24;

const WithUpdatedLabel = (formattedDate?: string) => {
	const i18nMessage = formattedDate ? messages.overOneMinuteText : messages.underOneMinuteText;

	return <FormattedMessage {...i18nMessage} values={{ date: formattedDate }} />;
};

export const SyncInfo = ({ lastSyncTime }: { lastSyncTime: Date }): React.JSX.Element => {
	const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(() =>
		Math.floor((Date.now() - lastSyncTime.getTime()) / 1000),
	);

	const totalDays = Math.floor(secondsSinceUpdate / SECONDS_IN_DAY);
	const totalHours = Math.floor(secondsSinceUpdate / SECONDS_IN_HR);
	const totalMinutes = Math.floor(secondsSinceUpdate / SECONDS_IN_MIN);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;
		const update = () => {
			const elapsedMs = Date.now() - lastSyncTime.getTime();
			setSecondsSinceUpdate(Math.floor(elapsedMs / 1000));
			// At eight days the label becomes a fixed date, so no further updates are needed.
			if (elapsedMs >= 8 * SECONDS_IN_DAY * 1000) {
				return;
			}
			const unitMs =
				(elapsedMs < SECONDS_IN_HR * 1000
					? SECONDS_IN_MIN
					: elapsedMs < SECONDS_IN_DAY * 1000
						? SECONDS_IN_HR
						: SECONDS_IN_DAY) * 1000;
			timeout = setTimeout(update, unitMs - (elapsedMs % unitMs));
		};
		update();
		return () => clearTimeout(timeout);
	}, [lastSyncTime]);

	if (totalMinutes >= 1 && totalMinutes < 60) {
		return (
			<FormattedRelativeTime value={-totalMinutes} style="long" unit="minute">
				{WithUpdatedLabel}
			</FormattedRelativeTime>
		);
	}

	if (totalHours >= 1 && totalHours < 24) {
		return (
			<FormattedRelativeTime value={-totalHours} style="long" unit="hour">
				{WithUpdatedLabel}
			</FormattedRelativeTime>
		);
	}

	if (totalDays >= 1 && totalDays < 8) {
		return (
			<FormattedRelativeTime value={-totalDays} style="long" unit="day">
				{WithUpdatedLabel}
			</FormattedRelativeTime>
		);
	}

	if (totalDays >= 8) {
		return (
			<FormattedDate year="numeric" month="short" day="2-digit" value={lastSyncTime}>
				{WithUpdatedLabel}
			</FormattedDate>
		);
	}

	return WithUpdatedLabel();
};
