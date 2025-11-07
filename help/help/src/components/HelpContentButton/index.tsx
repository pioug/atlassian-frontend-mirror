import React, { useCallback } from 'react';
import ShortcutIcon from '@atlaskit/icon/core/migration/link-external--shortcut';
import Tooltip from '@atlaskit/tooltip';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { type NotificationLogProvider } from '@atlaskit/notification-log-client';
import {
	useAnalyticsEvents,
	type UIAnalyticsEvent,
	AnalyticsContext,
} from '@atlaskit/analytics-next';

import {
	HelpContentButtonContainer,
	HelpContentButtonIcon,
	HelpContentButtonText,
	HelpContentButtonExternalLinkIcon,
	HelpContentButtonExternalNotificationIcon,
} from './styled';

export type Props = {
	href?: string;
	icon?: React.ReactChild;
	id?: string;
	notificationLogProvider?: Promise<NotificationLogProvider>;
	notificationMax?: number;
	onClick?: (id: string, analytics: UIAnalyticsEvent, event: React.MouseEvent<HTMLElement>) => void;
	text: string;
	tooltipText?: string;
};

const analitycsContextData = {
	componentName: 'HelpContentButton',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

const HelpContentButton = ({
	id = '',
	href,
	notificationMax = 3,
	notificationLogProvider,
	text,
	icon,
	onClick,
	tooltipText,
}: Props): React.JSX.Element => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const handleOnClick = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			if (onClick) {
				const analyticsEvent = createAnalyticsEvent({
					action: 'clicked',
				});

				onClick(id, analyticsEvent, event);
			}
		},
		[createAnalyticsEvent, id, onClick],
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLElement>) => {
			if (event.key === 'Enter' && onClick) {
				const analyticsEvent = createAnalyticsEvent({
					action: 'clicked',
				});

				onClick(id, analyticsEvent, event as unknown as React.MouseEvent<HTMLElement>);
			}
		},
		[createAnalyticsEvent, id, onClick],
	);

	const buttonContent = (
		<>
			<HelpContentButtonIcon>{icon}</HelpContentButtonIcon>
			<HelpContentButtonText>
				{text}
				{notificationLogProvider !== null && (
					<HelpContentButtonExternalNotificationIcon>
						<NotificationIndicator
							notificationLogProvider={notificationLogProvider}
							max={notificationMax}
							appearance="primary"
						/>
					</HelpContentButtonExternalNotificationIcon>
				)}
				{href != null && (
					<HelpContentButtonExternalLinkIcon dataTestId="shortcutIcon">
						<ShortcutIcon color="currentColor" LEGACY_size="small" label="" />
					</HelpContentButtonExternalLinkIcon>
				)}
			</HelpContentButtonText>
		</>
	);

	return (
		<AnalyticsContext data={analitycsContextData}>
			<HelpContentButtonContainer
				onClick={handleOnClick}
				onKeyDown={handleKeyDown}
				href={href}
				id={id}
				tabIndex={0}
				target={href && '_blank'}
			>
				{tooltipText ? (
					<Tooltip content={tooltipText} position="left">
						{buttonContent}
					</Tooltip>
				) : (
					<>{buttonContent}</>
				)}
			</HelpContentButtonContainer>
		</AnalyticsContext>
	);
};

export default HelpContentButton;
