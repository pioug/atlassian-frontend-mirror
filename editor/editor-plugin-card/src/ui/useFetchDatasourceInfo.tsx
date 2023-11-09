/** @jsx jsx */
import { useEffect, useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import type { JsonLdDatasourceResponse } from '@atlaskit/link-client-extension';
import type { JiraIssueDatasourceParameters } from '@atlaskit/link-datasource';
import type { CardContext } from '@atlaskit/link-provider';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { DatasourceParameters } from '@atlaskit/linking-types';

export interface useFetchDatasourceInfoProps {
  isRegularCardNode: boolean;
  url?: string;
  cardContext?: CardContext;
  nodeParameters?: DatasourceParameters | JiraIssueDatasourceParameters;
}

export const useFetchDatasourceInfo = ({
  isRegularCardNode,
  url,
  cardContext,
  nodeParameters,
}: useFetchDatasourceInfoProps) => {
  const [datasourceId, setDatasourceId] = useState<string | undefined>(
    undefined,
  );
  const [parameters, setParameters] = useState<
    DatasourceParameters | undefined
  >(nodeParameters);
  // Since fetchData() is async, using this ready check to see if we have the parameters before passing it to the modal.
  // Only non-datasource nodes will be not ready initially since we need to fetch data.
  const [ready, setReady] = useState<boolean>(!isRegularCardNode);

  useEffect(() => {
    const fetchDatasource = async () => {
      try {
        if (!url || !cardContext) {
          // Don't block rendering of modal of somehow we don't get these two args --> just open with empty params
          setReady(true);
          return;
        }

        const response = await cardContext?.connections?.client?.fetchData(url);
        const datasources =
          (response && (response as JsonLdDatasourceResponse).datasources) ||
          [];

        setDatasourceId(datasources[0]?.id);
        setParameters(datasources[0]?.parameters);
        setReady(true);
      } catch (e) {
        setDatasourceId(undefined);
        setParameters(undefined);
        // If fetch somehow errors, still set ready as true so we don't block the rendering of the modal.
        // It will just open with empty params.
        setReady(true);
      }
    };

    if (isRegularCardNode) {
      void fetchDatasource();
    }
  }, [isRegularCardNode, cardContext, url]);

  return {
    datasourceId,
    parameters,
    ready,
  };
};
