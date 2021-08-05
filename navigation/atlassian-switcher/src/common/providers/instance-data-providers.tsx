import React from 'react';

import { fetchJson, postJson } from '../utils/fetch';
import asDataProvider, { ResultComplete, Status } from './as-data-provider';
import {
  CollaborationGraphContainersResponse,
  Permissions,
  UserPermissionResponse,
  WithCloudId,
  XFlowSettingsResponse,
  ProviderResults,
} from '../../types';
import { withCached } from '../utils/with-cached';
import withHandleOptionalCloudId from './with-handle-optional-cloud-id';

const fetchCollaborationGraphRecentContainers = ({ cloudId }: WithCloudId) =>
  postJson<CollaborationGraphContainersResponse>(
    '/gateway/api/collaboration/v1/collaborationgraph/user/container',
    {
      containerTypes: ['confluenceSpace', 'jiraProject'],
      context: {
        contextType: 'atlassianSwitcher',
        principalId: 'context',
        siteId: cloudId,
      },
      expanded: true,
      maxNumberOfResults: 6,
      userId: 'context',
    },
  );

const RealCollaborationGraphRecentContainersProvider = asDataProvider(
  'collaborationGraphRecentContainers',
  fetchCollaborationGraphRecentContainers,
);

export const emptyCollaborationGraphRecentContainers: ResultComplete<CollaborationGraphContainersResponse> = {
  status: Status.COMPLETE,
  data: { collaborationGraphEntities: [] },
};

export const nullCollaborationGraphRecentContainers: ResultComplete<CollaborationGraphContainersResponse> = {
  status: Status.COMPLETE,
  data: { collaborationGraphEntities: null },
};

export const CollaborationGraphRecentContainersProvider = withHandleOptionalCloudId(
  ({
    cloudId,
    enableRecentContainers,
    children,
  }: {
    cloudId: string;
    enableRecentContainers?: boolean;
    children: (
      collaborationGraphRecentContainers: ProviderResults['collaborationGraphRecentContainers'],
    ) => React.ReactNode;
  }) => {
    if (enableRecentContainers) {
      return (
        <RealCollaborationGraphRecentContainersProvider cloudId={cloudId}>
          {children}
        </RealCollaborationGraphRecentContainersProvider>
      );
    }

    return (
      <React.Fragment>
        {children(emptyCollaborationGraphRecentContainers)}
      </React.Fragment>
    );
  },
  emptyCollaborationGraphRecentContainers.data,
);

// Permissions api
type FetchPermissionParamsType = WithCloudId & {
  permissionId: Permissions;
};
const fetchPermission = withCached(
  ({ cloudId, permissionId }: FetchPermissionParamsType) =>
    postJson<UserPermissionResponse>(`/gateway/api/permissions/permitted`, {
      permissionId,
      resourceId: `ari:cloud:platform::site/${cloudId}`,
    }).then((permission) => permission.permitted),
);

export const UserPermissionProvider = withHandleOptionalCloudId(
  asDataProvider('permission', fetchPermission, fetchPermission.cached),
  false,
);

// Xflow settings api
export const fetchXflowSettings = withCached(({ cloudId }: WithCloudId) =>
  fetchJson<XFlowSettingsResponse>(
    `/gateway/api/site/${cloudId}/setting/xflow`,
  ).then((xFlowSettings) =>
    xFlowSettings['product-suggestions-enabled'] !== undefined
      ? xFlowSettings['product-suggestions-enabled']
      : true,
  ),
);

export const XFlowSettingsProvider = withHandleOptionalCloudId(
  asDataProvider(
    'xflowSettings',
    fetchXflowSettings,
    fetchXflowSettings.cached,
  ),
  true,
);

export const prefetchAll = ({ cloudId }: WithCloudId) => {
  fetchXflowSettings({ cloudId });
  fetchPermission({ cloudId, permissionId: Permissions.MANAGE });
};

export const resetAll = () => {
  fetchXflowSettings.reset();
  fetchPermission.reset();
};
