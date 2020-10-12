import React from 'react';

import { ProviderResults } from '../../types';

import {
  RecentContainersProvider,
  UserPermissionProvider,
  XFlowSettingsProvider,
  CollaborationGraphRecentContainersProvider,
} from './instance-data-providers';
import { RecommendationsEngineProvider } from '../../cross-flow/providers/recommendations-provider';
import { Permissions, RecommendationsFeatureFlags } from '../../types';

interface CommonDataProviderProps {
  cloudId?: string;
  disableRecentContainers: boolean;
  enableCollaborationGraphRecentContainers?: boolean;
  recommendationsFeatureFlags?: RecommendationsFeatureFlags;
  children: (props: {
    recentContainers: ProviderResults['recentContainers'];
    managePermission: ProviderResults['managePermission'];
    addProductsPermission: ProviderResults['addProductsPermission'];
    isXFlowEnabled: ProviderResults['isXFlowEnabled'];
    productRecommendations: ProviderResults['productRecommendations'];
    collaborationGraphRecentContainers: ProviderResults['collaborationGraphRecentContainers'];
  }) => React.ReactElement<any>;
}

export default ({
  cloudId,
  children,
  enableCollaborationGraphRecentContainers,
  recommendationsFeatureFlags,
  disableRecentContainers,
}: CommonDataProviderProps) => {
  return (
    <CollaborationGraphRecentContainersProvider
      cloudId={cloudId}
      disableRecentContainers={disableRecentContainers}
      enableCollaborationGraphRecentContainers={
        enableCollaborationGraphRecentContainers
      }
    >
      {collaborationGraphRecentContainers => (
        <RecentContainersProvider
          cloudId={cloudId}
          disableRecentContainers={disableRecentContainers}
          enableCollaborationGraphRecentContainers={
            enableCollaborationGraphRecentContainers
          }
        >
          {recentContainers => (
            <UserPermissionProvider
              cloudId={cloudId}
              permissionId={Permissions.MANAGE}
            >
              {managePermission => (
                <UserPermissionProvider
                  cloudId={cloudId}
                  permissionId={Permissions.ADD_PRODUCTS}
                >
                  {addProductsPermission => (
                    <XFlowSettingsProvider cloudId={cloudId}>
                      {isXFlowEnabled => (
                        <RecommendationsEngineProvider
                          featureFlags={recommendationsFeatureFlags}
                        >
                          {productRecommendations =>
                            children({
                              recentContainers,
                              managePermission,
                              addProductsPermission,
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
            </UserPermissionProvider>
          )}
        </RecentContainersProvider>
      )}
    </CollaborationGraphRecentContainersProvider>
  );
};
