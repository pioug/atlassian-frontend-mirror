import React, { Suspense, useCallback, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { type Flag, GiveKudosLauncherLazy, KudosType } from '@atlaskit/give-kudos';
import { ButtonItem } from '@atlaskit/menu';

import { extractIdFromAri } from '../../../client/getTeamFromAGG';

import { messages } from './messages';
import { type ActionItem, MoreActions } from './more-actions';

const GIVE_KUDOS_ACTION_ID = 'give-kudos';

type BaseTeamActionsProps = {
	otherActions?: ActionItem[];
	cloudId: string;
	teamId: string;
	loading?: boolean;
};

type KudosEnabledProps = BaseTeamActionsProps & {
	isKudosEnabled: true;
	teamCentralBaseUrl: string;
	analyticsSource: string;
	showKudosFlag?: (flagConfig: Flag) => void;
};

type KudosDisabledProps = BaseTeamActionsProps & {
	isKudosEnabled?: false;
};

export type TeamActionsProps = KudosEnabledProps | KudosDisabledProps;

export const TeamActions = ({
	isKudosEnabled,
	otherActions,
	loading,
	...props
}: TeamActionsProps) => {
	const { formatMessage } = useIntl();
	const [isKudosOpen, setIsKudosOpen] = useState(false);

	const onKudosClick = useCallback(() => {
		setIsKudosOpen(true);
	}, []);

	const actions: ActionItem[] = [];
	let kudosProps = null;
	if (isKudosEnabled) {
		actions.push({
			id: GIVE_KUDOS_ACTION_ID,
			item: <ButtonItem onClick={onKudosClick}>{formatMessage(messages.giveKudos)}</ButtonItem>,
		});
		kudosProps = props as KudosEnabledProps;
	}
	if (otherActions) {
		actions.push(...otherActions);
	}

	if (actions.length === 0) {
		return null;
	}

	return (
		<>
			<MoreActions actions={actions} loading={loading} />
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
						addFlag={kudosProps.showKudosFlag}
					/>
				</Suspense>
			)}
		</>
	);
};
