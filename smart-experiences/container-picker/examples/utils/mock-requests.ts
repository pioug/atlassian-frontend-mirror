import { useEffect, useState } from 'react';
import fetchMock from 'fetch-mock/cjs/client';

import {
  CollaborationGraphResponse,
  ContainerType,
  ProjectResult,
  SearchResponse,
} from '../../src/service/transformer';

const mockEndpoints = () => {
  // Unmatched routes will fallback to the network
  fetchMock.config.fallbackToNetwork = true;

  const fakeContainerResponse: CollaborationGraphResponse = {
    collaborationGraphEntities: [
      {
        id: 'my-project',
        entityType: 'CONTAINER',
        containerType: ContainerType.JIRA_PROJECT,
        score: 0.5,
        containerDetails: {
          key: 'MP',
          id: 'my-project',
          name: 'My project',
          url: '',
          iconUrl: '',
        },
      },
    ],
  };

  fetchMock.mock(
    new RegExp(
      '/gateway/api/collaboration/v1/collaborationgraph/user/container',
    ),
    () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 250);
      }).then(() => fakeContainerResponse);
    },
    { method: 'POST', overwriteRoutes: false, sendAsJson: true },
  );

  const fakeContainerSearchRepsonse: SearchResponse<ProjectResult> = {
    scopes: [
      {
        id: 'jira.project',
        results: [
          {
            id: 'other-project',
            name: 'Other project',
            url: '',
            attributes: {
              type: '',
              projectType: '',
              avatar: { urls: {} },
            },
          },
        ],
      },
    ],
  };

  fetchMock.mock(
    new RegExp('/gateway/api/xpsearch-aggregator/quicksearch/v1'),
    () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 250);
      }).then(() => fakeContainerSearchRepsonse);
    },
    { method: 'POST', overwriteRoutes: false, sendAsJson: true },
  );
};

// Simple hook for using inside example pages, which sets up the mock API responses, and then
// un-sets the mock API responses when the example is exited.
export const useEndpointMocks = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 250);
  }, []);

  useEffect(() => {
    mockEndpoints();

    return () => fetchMock.reset();
  }, []);

  return { ready };
};
