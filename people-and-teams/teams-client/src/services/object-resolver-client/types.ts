/**
 * This type matches the props for the TeamLinkIcon component in embeddable-directory
 */
export type LinkIconData = {
	linkUrl: string;
	iconUrl: string | undefined;
	productName: string;
};

export interface RawLinkData {
	url: string;
	generator: {
		name: string;
		icon?:
			| string
			| {
					url: string;
			  };
	};
}

/**
 * These names match the Provider Name in the JSON-LD response from respective resolvers
 */
export enum ProviderNames {
	CONFLUENCE = 'Confluence',
	JIRA = 'Jira',
}

export interface IconItemSuccess {
	body: {
		data: RawLinkData;
	};
	status: number;
}

export interface IconItemFailure {
	error: {
		type: string;
		message: string;
		status: number;
	};
	status: number;
}

export type GetAriFromUrlErrorType =
	| 'AuthError'
	| 'UnsupportedError'
	| 'TimeoutError'
	| 'InternalServerError';
export interface GetAriFromUrlResponse {
	meta: Record<string, unknown>;
	data: {
		ari: string;
		url: string;
	};
}
export interface GetAriFromUrlError {
	error: {
		type: GetAriFromUrlErrorType;
		message: string;
		status: number;
	};
}
