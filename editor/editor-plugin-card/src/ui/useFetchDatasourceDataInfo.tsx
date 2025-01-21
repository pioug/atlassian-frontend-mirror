/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import {
	DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE,
	useDatasourceClientExtension,
} from '@atlaskit/link-client-extension';
import type { JiraIssueDatasourceParameters } from '@atlaskit/link-datasource';
import type { DatasourceParameters, DatasourceDataRequest } from '@atlaskit/linking-types';

export interface useFetchDatasourceDataInfoProps {
	datasourceId: string;
	parameters?: DatasourceParameters | JiraIssueDatasourceParameters;
	visibleColumnKeys?: string[];
}

export const useFetchDatasourceDataInfo = ({
	datasourceId,
	parameters,
	visibleColumnKeys,
}: useFetchDatasourceDataInfoProps) => {
	const [extensionKey, setExtensionKey] = useState<string | undefined>(undefined);
	const { getDatasourceData } = useDatasourceClientExtension();

	useEffect(() => {
		const fetchDatasource = async () => {
			try {
				if (!datasourceId || !parameters || !visibleColumnKeys) {
					return;
				}
				const datasourceDataRequest: DatasourceDataRequest = {
					parameters,
					pageSize: DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE,
					pageCursor: undefined,
					fields: visibleColumnKeys,
					includeSchema: true,
				};

				const { meta } = await getDatasourceData(datasourceId, datasourceDataRequest, false);
				setExtensionKey(meta.extensionKey);
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e);
				setExtensionKey(undefined);
			}
		};
		void fetchDatasource();
	}, [getDatasourceData, visibleColumnKeys, parameters, datasourceId]);

	return {
		extensionKey,
	};
};
