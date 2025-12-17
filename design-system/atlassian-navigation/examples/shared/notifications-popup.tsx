/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Notifications } from '@atlaskit/atlassian-navigation';
import { Notifications as NotificationsIframe } from '@atlaskit/atlassian-notifications';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { NotificationLogClient } from '@atlaskit/notification-log-client';
import Popup from '@atlaskit/popup';

const wrapperStyles = css({
	display: 'flex',
	width: 540,
	height: 'calc(100vh - 200px)',
	paddingBlockStart: 18,
	paddingInlineStart: 18,
});

const NotificationsContent = () => (
	<div css={wrapperStyles}>
		<NotificationsIframe
			// _url="https://start.stg.atlassian.com/notificationsDrawer/iframe.html?scope=user&product=uchi&locale=en"
			_url="https://start.stg.atlassian.com/notificationsDrawer/iframe.html"
			locale="en"
			product="jira"
			testId="jira-notifications"
			title="Notifications"
		/>
	</div>
);

class MockNotificationLogClient extends NotificationLogClient {
	mockedCount = 0;
	constructor(mockedCount: number) {
		super('', '');
		this.mockedCount = mockedCount;
	}

	public async countUnseenNotifications() {
		return Promise.resolve({ count: this.mockedCount });
	}
}

const client = new MockNotificationLogClient(5);
const emptyClient = new MockNotificationLogClient(0);

export const NotificationsPopup = (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const [interacted, setInteracted] = useState(false);
	const [buttonLabel, setButtonLabel] = useState<number | undefined>();

	const NotificationsBadge = () => (
		<NotificationIndicator
			onCountUpdated={updateButtonLabel}
			// force a zero-count after the drawer has been opened
			notificationLogProvider={Promise.resolve(interacted ? emptyClient : client)}
		/>
	);

	const updateButtonLabel = ({ newCount }: { newCount: number }) => {
		setButtonLabel(newCount || 0);
	};

	const onClick = () => {
		// let the badge icon know to clear its count
		setInteracted(true);
		setIsOpen(!isOpen);
	};

	const onClose = () => {
		setIsOpen(false);
	};

	return (
		<Popup
			shouldRenderToParent
			placement="bottom-start"
			content={NotificationsContent}
			isOpen={isOpen}
			onClose={onClose}
			trigger={(triggerProps) => (
				<Notifications
					badge={NotificationsBadge}
					onClick={onClick}
					testId={'notifications-popup-trigger'}
					tooltip={`Notifications (${buttonLabel})`}
					isSelected={isOpen}
					{...triggerProps}
				/>
			)}
		/>
	);
};
