import { type CardAuthFlowOpts, type EnvironmentsKeys } from '@atlaskit/link-provider';

import { type CardAppearance } from '../../src';

export type ExampleUrls = Array<ExampleUrl>;
export interface ExampleResourceType {
	displayName: string;
	resourceType: string;
	urls: string[];
}
export type ExampleRolloutStatus = 'not-started' | 'rolling-out' | 'rolled-out';
export interface ExampleUrl {
	avatarUrl: string;
	category: string;
	examples: ExampleResourceType[];
	reliability: {
		auth: boolean;
		definitionId: {
			production: string;
			staging: string;
		};
		extensionKey: string;
		tier: number;
	};
	resolver: string;
	rollout: {
		percentage: number;
		status: ExampleRolloutStatus;
	};
}
export interface ExampleUIConfig {
	appearance: CardAppearance;
	authFlow: CardAuthFlowOpts['authFlow'];
	environment: EnvironmentsKeys;
	selectedEntities: string[];
}
