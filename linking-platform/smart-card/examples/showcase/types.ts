import { type CardAuthFlowOpts, type EnvironmentsKeys } from '@atlaskit/link-provider';

import { type CardAppearance } from '../../src';

export type ExampleUrls = Array<ExampleUrl>;
export interface ExampleResourceType {
	resourceType: string;
	displayName: string;
	urls: string[];
}
export type ExampleRolloutStatus = 'not-started' | 'rolling-out' | 'rolled-out';
export interface ExampleUrl {
	resolver: string;
	category: string;
	avatarUrl: string;
	examples: ExampleResourceType[];
	rollout: {
		status: ExampleRolloutStatus;
		percentage: number;
	};
	reliability: {
		tier: number;
		extensionKey: string;
		definitionId: {
			staging: string;
			production: string;
		};
		auth: boolean;
	};
}
export interface ExampleUIConfig {
	appearance: CardAppearance;
	authFlow: CardAuthFlowOpts['authFlow'];
	environment: EnvironmentsKeys;
	selectedEntities: string[];
}
