import React from 'react';

import { fetchJson, postJson } from '../utils/fetch';
import asDataProvider, { ResultComplete, Status } from './as-data-provider';
import {
  CollaborationGraphContainersResponse,
  Permissions,
  RecentContainersResponse,
  UserPermissionResponse,
  WithCloudId,
  XFlowSettingsResponse,
  ProviderResults,
} from '../../types';
import { withCached } from '../utils/with-cached';
import withHandleOptionalCloudId from './with-handle-optional-cloud-id';

// Recent activity api
const fetchRecentContainers = ({ cloudId }: WithCloudId) =>
  fetchJson<RecentContainersResponse>(
    `/gateway/api/activity/api/client/recent/containers?cloudId=${cloudId}`,
  );

const fetchCollaborationGraphRecentContainers = ({ cloudId }: WithCloudId) =>
  postJson<CollaborationGraphContainersResponse>(
    'gateway/api/v1/collaborationgraph/user/container',
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

const RealRecentContainersProvider = asDataProvider(
  'recentContainers',
  fetchRecentContainers,
);

const RealCollaborationGraphRecentContainersProvider = asDataProvider(
  'collaborationGraphRecentContainers',
  fetchCollaborationGraphRecentContainers,
);

export const emptyRecentContainers: ResultComplete<RecentContainersResponse> = {
  status: Status.COMPLETE,
  data: { data: [] },
};

export const emptyCollaborationGraphRecentContainers: ResultComplete<CollaborationGraphContainersResponse> = {
  status: Status.COMPLETE,
  data: { collaborationGraphEntities: [] },
};

export const nullRecentContainers: ResultComplete<RecentContainersResponse> = {
  status: Status.COMPLETE,
  data: { data: null },
};

export const nullCollaborationGraphRecentContainers: ResultComplete<CollaborationGraphContainersResponse> = {
  status: Status.COMPLETE,
  data: { collaborationGraphEntities: null },
};

export const CollaborationGraphRecentContainersProvider = withHandleOptionalCloudId(
  ({
    cloudId,
    disableRecentContainers,
    enableCollaborationGraphRecentContainers,
    children,
  }: {
    cloudId: string;
    disableRecentContainers?: boolean;
    children: (
      collaborationGraphRecentContainers: ProviderResults['collaborationGraphRecentContainers'],
    ) => React.ReactNode;
    enableCollaborationGraphRecentContainers?: boolean;
  }) => {
    if (disableRecentContainers) {
      return (
        <React.Fragment>
          {children(emptyCollaborationGraphRecentContainers)}
        </React.Fragment>
      );
    }

    if (enableCollaborationGraphRecentContainers) {
      return (
        <RealCollaborationGraphRecentContainersProvider cloudId={cloudId}>
          {children}
        </RealCollaborationGraphRecentContainersProvider>
      );
    }

    // Returns null so that map-results-to-switcher-props.ts knows this provider is off
    return (
      <React.Fragment>
        {children(nullCollaborationGraphRecentContainers)}
      </React.Fragment>
    );
  },
  emptyCollaborationGraphRecentContainers.data,
);

export const RecentContainersProvider = withHandleOptionalCloudId(
  ({
    cloudId,
    disableRecentContainers,
    enableCollaborationGraphRecentContainers,
    children,
  }: {
    disableRecentContainers?: boolean;
    children: (
      recentContainers: ProviderResults['recentContainers'],
    ) => React.ReactNode;
    enableCollaborationGraphRecentContainers?: boolean;
  } & WithCloudId) => {
    if (disableRecentContainers) {
      return <React.Fragment>{children(emptyRecentContainers)}</React.Fragment>;
    }

    if (!enableCollaborationGraphRecentContainers) {
      return (
        <RealRecentContainersProvider cloudId={cloudId}>
          {children}
        </RealRecentContainersProvider>
      );
    }

    return <React.Fragment>{children(nullRecentContainers)}</React.Fragment>;
  },
  emptyRecentContainers.data,
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
    }).then(permission => permission.permitted),
);

export const UserPermissionProvider = withHandleOptionalCloudId(
  asDataProvider('permission', fetchPermission, fetchPermission.cached),
  false,
);

// Xflow settings api
const fetchXflowSettings = withCached(({ cloudId }: WithCloudId) =>
  fetchJson<XFlowSettingsResponse>(
    `/gateway/api/site/${cloudId}/setting/xflow`,
  ).then(xFlowSettings =>
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
  fetchPermission({
    cloudId,
    permissionId: Permissions.ADD_PRODUCTS,
  });
  fetchPermission({ cloudId, permissionId: Permissions.MANAGE });
};

export const resetAll = () => {
  fetchXflowSettings.reset();
  fetchPermission.reset();
};
