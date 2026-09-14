import { type ProductPermissionsResponse } from '../types';

export type EndpointConfigValue =
	| {
			type: 'rest' | 'graphql';
			url: string;
			query: string;
			variables?: Record<string, any>;
			transformResponse: (response: any) => ProductPermissionsResponse;
	  }
	| {
			type: 'default';
			payload: {
				product: string;
				permissionId: string;
			};
	  }
	| undefined;
