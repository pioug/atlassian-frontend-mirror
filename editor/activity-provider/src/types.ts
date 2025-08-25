export interface ActivityItem {
	container: string;
	iconUrl: string;
	name: string;
	objectId: string;
	type?: string;
	url: string;
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
	product: ActivityProduct;
	type: ActivitiesContainerType;
}

export interface ActivityObject {
	cloudId: string;
	containers: Array<ActivityContainer>;
	iconUrl: string;
	id: string;
	localResourceId: string;
	name: string;
	product: ActivityProduct;
	type: ActivityObjectType;
	url: string;
}

export interface ActivityResponse {
	data: {
		activities: {
			myActivities: {
				viewed: {
					nodes: Array<{
						id: string;
						object: ActivityObject;
						timestamp: string;
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
