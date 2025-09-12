import { useEffect, useRef } from 'react';

import { useToolbarUI } from '../hooks/ui-context';

export const ACTION_SUBJECT = {
	TOOLBAR: 'toolbar',
	TOOLBAR_DROPDOWN_MENU: 'toolbarDropdownMenu',
};

export type ViewEventEmitterProps = {
	actionSubject?: string;
	/**
	 * Name of dropdown to identify in analytic events
	 */
	actionSubjectId?: string;
};

export const ViewEventEmitter = ({ actionSubjectId, actionSubject }: ViewEventEmitterProps) => {
	const isMountedRef = useRef(false);
	const { fireAnalyticsEvent } = useToolbarUI();

	useEffect(() => {
		if (isMountedRef.current) {
			return;
		}
		isMountedRef.current = true;

		const payload = {
			action: 'viewed',
			actionSubject,
			actionSubjectId,
			eventType: 'ui',
		};

		fireAnalyticsEvent && fireAnalyticsEvent(payload);
	}, [actionSubjectId, actionSubject, fireAnalyticsEvent]);

	return null;
};
