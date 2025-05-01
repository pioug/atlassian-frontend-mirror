import React, { Suspense, useCallback, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { LinkButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { GiveKudosLauncherLazy, KudosType } from '@atlaskit/give-kudos';
import { ButtonItem } from '@atlaskit/menu';
import { Box, Inline, Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { extractIdFromAri } from '../../../client/getTeamFromAGG';
import { fireEvent } from '../../../util/analytics';

import { messages } from './messages';
import { ActionItem, MoreActions } from './more-actions';

const GIVE_KUDOS_ACTION_ID = 'give-kudos';

const styles = cssMap({
	containerStyles: {
		borderTopWidth: token('border.width'),
		borderTopStyle: 'solid',
		borderTopColor: token('color.border'),
		paddingLeft: token('space.300'),
		paddingRight: token('space.300'),
		paddingTop: token('space.200'),
	},
	actionContainerStyles: {
		flexGrow: 1,
	},
});

type BaseButtonSectionProps = {
	teamProfileUrl?: string;
	otherActions?: ActionItem[];
	cloudId: string;
	teamId: string;
};

type KudosEnabledProps = BaseButtonSectionProps & {
	isKudosEnabled: true;
	teamCentralBaseUrl: string;
	analyticsSource: string;
};

type KudosDisabledProps = BaseButtonSectionProps & {
	isKudosEnabled?: false;
};

export type ButtonSectionProps = KudosEnabledProps | KudosDisabledProps;

export const ButtonSection = ({
	teamProfileUrl,
	isKudosEnabled,
	otherActions,
	...props
}: ButtonSectionProps) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const { formatMessage } = useIntl();
	const [isKudosOpen, setIsKudosOpen] = useState(false);

	const onTeamProfileClick = useCallback(() => {
		if (createAnalyticsEvent) {
			fireEvent(createAnalyticsEvent, {
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId: 'viewTeamProfileButton',
				attributes: {},
			});
		}
	}, [createAnalyticsEvent]);

	const onKudosClick = useCallback(() => {
		setIsKudosOpen(true);
	}, []);

	const extraActions: ActionItem[] = [];
	let kudosProps = null;
	if (isKudosEnabled) {
		extraActions.push({
			id: GIVE_KUDOS_ACTION_ID,
			item: <ButtonItem onClick={onKudosClick}>{formatMessage(messages.giveKudos)}</ButtonItem>,
		});
		kudosProps = props as KudosEnabledProps;
	}
	if (otherActions) {
		extraActions.push(...otherActions);
	}

	return (
		<>
			<Stack xcss={styles.containerStyles}>
				<Inline space="space.050">
					{teamProfileUrl && (
						<Box xcss={styles.actionContainerStyles}>
							<LinkButton
								onClick={onTeamProfileClick}
								href={teamProfileUrl}
								target="_blank"
								shouldFitContainer
							>
								{formatMessage(messages.viewProfile)}
							</LinkButton>
						</Box>
					)}
					{extraActions.length > 0 && <MoreActions actions={extraActions} />}
				</Inline>
			</Stack>
			{isKudosEnabled && kudosProps && (
				<Suspense fallback={null}>
					<GiveKudosLauncherLazy
						isOpen={isKudosOpen}
						onClose={() => setIsKudosOpen(false)}
						recipient={{
							type: KudosType.TEAM,
							recipientId: extractIdFromAri(kudosProps.teamId),
						}}
						analyticsSource={kudosProps.analyticsSource}
						teamCentralBaseUrl={kudosProps.teamCentralBaseUrl}
						cloudId={kudosProps.cloudId}
					/>
				</Suspense>
			)}
		</>
	);
};
