import React from 'react';

import { ProviderResults } from '../../types';

import {
  UserPermissionProvider,
  XFlowSettingsProvider,
  CollaborationGraphRecentContainersProvider,
} from './instance-data-providers';
import { RecommendationsEngineProvider } from '../../cross-flow/providers/recommendations-provider';
import { Permissions, RecommendationsFeatureFlags } from '../../types';

interface CommonDataProviderProps {
  cloudId?: string;
  enableRecentContainers: boolean;
  recommendationsFeatureFlags?: RecommendationsFeatureFlags;
  children: (props: {
    managePermission: ProviderResults['managePermission'];
    isXFlowEnabled: ProviderResults['isXFlowEnabled'];
    productRecommendations: ProviderResults['productRecommendations'];
    collaborationGraphRecentContainers: ProviderResults['collaborationGraphRecentContainers'];
  }) => React.ReactElement<any>;
}

export default ({
  cloudId,
  children,
  recommendationsFeatureFlags,
  enableRecentContainers,
}: CommonDataProviderProps) => {
  return (
    <CollaborationGraphRecentContainersProvider
      cloudId={cloudId}
      enableRecentContainers={enableRecentContainers}
    >
      {(collaborationGraphRecentContainers) => (
        <UserPermissionProvider
          cloudId={cloudId}
          permissionId={Permissions.MANAGE}
        >
          {(managePermission) => (
            <XFlowSettingsProvider cloudId={cloudId}>
              {(isXFlowEnabled) => (
                <RecommendationsEngineProvider
                  featureFlags={recommendationsFeatureFlags}
                >
                  {(productRecommendations) =>
                    children({
                      managePermission,
                      isXFlowEnabled,
                      productRecommendations,
                      collaborationGraphRecentContainers,
                    })
                  }
                </RecommendationsEngineProvider>
              )}
            </XFlowSettingsProvider>
          )}
        </UserPermissionProvider>
      )}
    </CollaborationGraphRecentContainersProvider>
  );
};
