import type { ClientConfig } from '../base-client';
import { DEFAULT_CONFIG } from '../constants';
import { BaseGraphQlClient } from '../graphql-client';
import { logException } from '../sentry/main';

import ReportingLinesQueryWithAccountStatus from './utils/queries/ReportingLinesQueryWithAccountStatus.graphql';
import type { ReportingLines } from './utils/types';

const SERVICE_URL = `${DEFAULT_CONFIG.stargateRoot}/watermelon/graphql`;

export class ReportingLinesClient extends BaseGraphQlClient {
	constructor(config: ClientConfig) {
		super(SERVICE_URL, config);
	}

	async getReportingLines(userId: string): Promise<{ reportingLines: ReportingLines }> {
		const response = await this.makeGraphQLRequest<
			'reportingLines',
			ReportingLines,
			{ aaid: string }
		>(
			{
				query: ReportingLinesQueryWithAccountStatus,
				variables: {
					aaid: userId,
				},
			},
			{
				operationName: 'ReportingLines',
			},
		);

		return response;
	}
}

export default new ReportingLinesClient({ logException });
