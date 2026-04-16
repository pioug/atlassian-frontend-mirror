import React, { useCallback } from 'react';

import { useAnalyticsEvents, type UIAnalyticsEvent, type AnalyticsEventPayload } from '../../src';

type AnalyticsButtonProps = {
	analyticsEventPayload: AnalyticsEventPayload;
	children: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => void;
};

const buttonStyles: React.CSSProperties = {
	backgroundColor: '#0052cc',
	border: 'none',
	borderRadius: 3,
	color: '#ffffff',
	cursor: 'pointer',
	fontSize: 14,
	fontWeight: 500,
	padding: '8px 12px',
};

export default function AnalyticsButton({
	analyticsEventPayload,
	children,
	onClick,
}: AnalyticsButtonProps): React.JSX.Element {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			const analyticsEvent = createAnalyticsEvent(analyticsEventPayload);
			onClick?.(event, analyticsEvent);
		},
		[analyticsEventPayload, createAnalyticsEvent, onClick],
	);

	return (
		/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- This legacy example intentionally keeps a plain HTML button with inline styles to avoid restoring docs-only ADS dependencies. */
		<button onClick={handleClick} style={buttonStyles} type="button">
			{children}
		</button>
	);
}
