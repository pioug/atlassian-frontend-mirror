import React, { type FC, type MouseEvent, type PropsWithChildren, useCallback } from 'react';

import {
	AnalyticsListener,
	type CreateUIAnalyticsEvent,
	type UIAnalyticsEvent,
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
} from '../src';

interface ButtonProps extends WithAnalyticsEventsProps {
	onClick?: (e: MouseEvent<HTMLButtonElement>, analyticsEvent?: UIAnalyticsEvent) => void;
}

const Button: FC<ButtonProps> = ({ createAnalyticsEvent, ...props }) => <button {...props} />;

const AtlaskitButton = withAnalyticsEvents({
	onClick: (create: CreateUIAnalyticsEvent) => {
		create({ action: 'click', version: '1.2.3' }).fire('atlaskit');
		return create({ action: 'click' });
	},
})(Button);

type MediaProps = PropsWithChildren<{
	onClick: (e: MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent | null) => void;
}>;

const MediaComponent = (props: MediaProps) => {
	const onClick = (e: MouseEvent<HTMLButtonElement>, analyticsEvent?: UIAnalyticsEvent) => {
		const publicEvent = analyticsEvent!.update({ action: 'submit' }).clone();
		analyticsEvent!.update({ value: 'some media-related data' }).fire('media');

		props.onClick(e, publicEvent);
	};

	return <AtlaskitButton {...props} onClick={onClick} />;
};

interface JiraProps {
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const JiraApp: FC<JiraProps> = ({ onClick, ...rest }: JiraProps) => {
	const handleClick = useCallback(
		(e: MouseEvent<HTMLButtonElement>, analyticsEvent?: UIAnalyticsEvent | null) => {
			if (analyticsEvent) {
				analyticsEvent.update({ action: 'issue-updated', issueId: 123 }).fire('jira');
			}

			if (onClick) {
				onClick(e);
			}
		},
		[onClick],
	);

	return (
		<MediaComponent {...rest} onClick={handleClick}>
			Click me
		</MediaComponent>
	);
};
export default () => {
	const onEvent = (event: UIAnalyticsEvent, channel: string = 'undefined') => {
		console.log(`Received event on ${channel.toUpperCase()} channel. Payload:`, event.payload);
	};

	return (
		<AnalyticsListener channel="jira" onEvent={onEvent}>
			<AnalyticsListener channel="media" onEvent={onEvent}>
				<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
					<JiraApp />
				</AnalyticsListener>
			</AnalyticsListener>
		</AnalyticsListener>
	);
};
