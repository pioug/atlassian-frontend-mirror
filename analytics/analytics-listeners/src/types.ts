import type Logger from './helpers/logger';
import { type GasPurePayload, type GasPureScreenEventPayload } from '@atlaskit/analytics-gas-types';

export type AnalyticsWebClient = {
	sendUIEvent: (event: GasPurePayload) => void;
	sendOperationalEvent: (event: GasPurePayload) => void;
	sendTrackEvent: (event: GasPurePayload) => void;
	sendScreenEvent: (event: GasPureScreenEventPayload) => void;
};

export type ListenerProps = {
	children?: React.ReactNode;
	client?: AnalyticsWebClient | Promise<AnalyticsWebClient>;
	logger: Logger;
};

export enum FabricChannel {
	atlaskit = 'atlaskit',
	elements = 'fabric-elements',
	navigation = 'navigation',
	editor = 'editor',
	media = 'media',
	peopleTeams = 'peopleTeams',
	notifications = 'notifications',
	recentWork = 'recentWork',
	atlas = 'atlas',
	crossFlow = 'crossFlow',
	linkingPlatform = 'linkingPlatform',
	postOffice = 'postOffice',
	aiMate = 'aiMate',
	avp = 'avp',
	growth = 'growth',
	omniChannel = 'omniChannel',
}
