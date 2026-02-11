import React from 'react';

import { type AnalyticsWebClient, FabricChannel, type ListenerProps } from './types';
import FabricElementsListener from './fabric/FabricElementsListener';
import AtlaskitListener from './atlaskit/AtlaskitListener';
import Logger from './helpers/logger';
import NavigationListener from './navigation/NavigationListener';
import FabricEditorListener from './fabric/FabricEditorListener';
import MediaAnalyticsListener from './media/MediaAnalyticsListener';
import PeopleTeamsAnalyticsListener from './peopleTeams/PeopleTeamsAnalyticsListener';
import NotificationsAnalyticsListener from './notifications/NotificationsAnalyticsListener';
import RecentWorkAnalyticsListener from './recentWork/RecentWorkAnalyticsListener';
import AtlasAnalyticsListener from './atlas/AtlasAnalyticsListener';
import CrossFlowAnalyticsListener from './cross-flow/CrossFlowAnalyticsListener';
import LinkingPlatformAnalyticsListener from './linkingPlatform/LinkingPlatformAnalyticsListener';
import PostOfficeAnalyticsListener from './postOffice/PostOfficeAnalyticsListener';
import AIMateAnalyticsListener from './aiMate/AIMateAnalyticsListener';
import AVPAnalyticsListener from './avp/AVPAnalyticsListener';
import GrowthAnalyticsListener from './growth/GrowthAnalyticsListener';
import OmniChannelAnalyticsListener from './omni-channel/OmniChannelAnalyticsListener';
import TownsquareHomeAnalyticsListener from './townsquareHome/TownsquareHomeAnalyticsListener';
import RovoExtensionAnalyticsListener from './rovoExtension/RovoExtensionAnalyticsListener';
import TeamworkGraphAnalyticsListener from './teamworkGraph/TeamworkGraphAnalyticsListener';

export type Props = {
	/** Children! */
	children?: React.ReactNode;
	client?: AnalyticsWebClient | Promise<AnalyticsWebClient>;
	/** A list of individual listeners to exclude, identified by channel */
	excludedChannels?: FabricChannel[];
	logLevel?: number;
};

const listenerMap = {
	[FabricChannel.elements]: FabricElementsListener,
	[FabricChannel.editor]: FabricEditorListener,
	[FabricChannel.atlaskit]: AtlaskitListener,
	[FabricChannel.navigation]: NavigationListener,
	[FabricChannel.media]: MediaAnalyticsListener,
	[FabricChannel.peopleTeams]: PeopleTeamsAnalyticsListener,
	[FabricChannel.notifications]: NotificationsAnalyticsListener,
	[FabricChannel.recentWork]: RecentWorkAnalyticsListener,
	[FabricChannel.atlas]: AtlasAnalyticsListener,
	[FabricChannel.crossFlow]: CrossFlowAnalyticsListener,
	[FabricChannel.linkingPlatform]: LinkingPlatformAnalyticsListener,
	[FabricChannel.postOffice]: PostOfficeAnalyticsListener,
	[FabricChannel.aiMate]: AIMateAnalyticsListener,
	[FabricChannel.avp]: AVPAnalyticsListener,
	[FabricChannel.growth]: GrowthAnalyticsListener,
	[FabricChannel.omniChannel]: OmniChannelAnalyticsListener,
	[FabricChannel.townsquareHome]: TownsquareHomeAnalyticsListener,
	[FabricChannel.rovoExtension]: RovoExtensionAnalyticsListener,
	[FabricChannel.teamworkGraph]: TeamworkGraphAnalyticsListener,
};

class FabricAnalyticsListeners extends React.Component<Props> {
	logger: Logger;

	constructor(props: Props) {
		super(props);

		this.logger = new Logger({ logLevel: props.logLevel });
	}

	render(): React.ReactNode {
		const { client, children, logLevel, excludedChannels } = this.props;
		if (typeof logLevel === 'number') {
			this.logger.setLogLevel(logLevel);
		}

		const listeners = (Object.keys(listenerMap) as FabricChannel[])
			.filter((channel) => !excludedChannels || excludedChannels.indexOf(channel) < 0)
			.map((channel) => listenerMap[channel])
			.reduce(
				(prev: React.ReactNode, Listener: React.ComponentType<ListenerProps>) => (
					<Listener client={client} logger={this.logger}>
						{prev}
					</Listener>
				),
				children,
			);

		return listeners;
	}
}

export default FabricAnalyticsListeners;
