export interface ActivityItem {
	objectId: string;
	name: string;
	container: string;
	url: string;
	iconUrl: string;
	type?: string;
	viewedTimestamp?: string;
}

type ActivityProduct =
	| 'JIRA'
	| 'JIRA_BUSINESS'
	| 'JIRA_SOFTWARE'
	| 'JIRA_OPS'
	| 'JIRA_SERVICE_DESK'
	| 'CONFLUENCE';
type ActivitiesContainerType = 'SITE' | 'PROJECT' | 'SPACE';
export type ActivityObjectType = 'ISSUE' | 'PAGE' | 'BLOGPOST';
export interface ActivityContainer {
	id: string;
	name: string | null;
	type: ActivitiesContainerType;
	product: ActivityProduct;
}

export interface ActivityObject {
	id: string;
	localResourceId: string;
	name: string;
	type: ActivityObjectType;
	product: ActivityProduct;
	cloudId: string;
	url: string;
	iconUrl: string;
	containers: Array<ActivityContainer>;
}

export interface ActivityResponse {
	data: {
		activities: {
			myActivities: {
				viewed: {
					nodes: Array<{
						id: string;
						timestamp: string;
						object: ActivityObject;
					}>;
				};
			};
		};
	};
}

export interface ActivityProvider {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getRecentItems(): Promise<Array<ActivityItem>>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	searchRecent(query: string): Promise<Array<ActivityItem>>;
}
