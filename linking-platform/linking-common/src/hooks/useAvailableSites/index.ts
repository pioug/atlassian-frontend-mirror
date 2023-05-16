import { useState, useEffect } from 'react';

import {
  AvailableSite,
  AvailableSitesProductType,
  AvailableSitesRequest,
  AvailableSitesResponse,
} from './types';

const defaultProducts = [
  AvailableSitesProductType.WHITEBOARD,
  AvailableSitesProductType.BEACON,
  AvailableSitesProductType.COMPASS,
  AvailableSitesProductType.CONFLUENCE,
  AvailableSitesProductType.JIRA_BUSINESS,
  AvailableSitesProductType.JIRA_INCIDENT_MANAGER,
  AvailableSitesProductType.JIRA_PRODUCT_DISCOVERY,
  AvailableSitesProductType.JIRA_SERVICE_DESK,
  AvailableSitesProductType.JIRA_SOFTWARE,
  AvailableSitesProductType.MERCURY,
  AvailableSitesProductType.OPSGENIE,
  AvailableSitesProductType.STATUS_PAGE,
  AvailableSitesProductType.ATLAS,
];
export const useAvailableSites = () => {
  const [state, setState] = useState<{
    data: AvailableSite[];
    loading: boolean;
    error?: Error;
  }>({
    data: [],
    loading: true,
  });

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { sites } = await getAvailableSites({
          products: defaultProducts,
        });
        setState({
          data: sites,
          loading: false,
          error: undefined,
        });
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error('unknown error');
        // TODO: analytics
        setState({
          data: [],
          loading: false,
          error,
        });
      }
    };
    fetchSites();
  }, []);

  return state;
};

async function getAvailableSites({
  products,
}: AvailableSitesRequest): Promise<AvailableSitesResponse> {
  const requestConfig = {
    method: 'POST',
    credentials: 'include' as RequestCredentials,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products,
    }),
  };

  const response = await window.fetch(
    `/gateway/api/available-sites`,
    requestConfig,
  );
  if (response.ok) {
    return response.json();
  }
  throw response;
}
