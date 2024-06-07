import React, { useCallback, useEffect, useState } from 'react';

import { FormattedDate, FormattedMessage, FormattedRelativeTime } from 'react-intl-next';

import { messages } from './messages';

const SECONDS_IN_MIN = 60;
const SECONDS_IN_HR = SECONDS_IN_MIN * 60;
const SECONDS_IN_DAY = SECONDS_IN_HR * 24;

const WithUpdatedLabel = (formattedDate?: string) => {
	const i18nMessage = formattedDate ? messages.overOneMinuteText : messages.underOneMinuteText;

	return <FormattedMessage {...i18nMessage} values={{ date: formattedDate }} />;
};

export const SyncInfo = ({ lastSyncTime }: { lastSyncTime: Date }) => {
	const calculateTimeDiff = useCallback(
		() => Math.floor((Date.now() - lastSyncTime.getTime()) / 1000),
		[lastSyncTime],
	);

	const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(calculateTimeDiff());

	const totalDays = Math.floor(secondsSinceUpdate / SECONDS_IN_DAY);
	const totalHours = Math.floor(secondsSinceUpdate / SECONDS_IN_HR);
	const totalMinutes = Math.floor(secondsSinceUpdate / SECONDS_IN_MIN);

	useEffect(() => {
		setSecondsSinceUpdate(calculateTimeDiff());
		const interval = setInterval(() => setSecondsSinceUpdate(calculateTimeDiff()), 1000);
		return () => clearInterval(interval);
	}, [lastSyncTime, calculateTimeDiff]);

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
