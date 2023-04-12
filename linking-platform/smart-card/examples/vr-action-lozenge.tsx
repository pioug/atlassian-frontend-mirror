import React from 'react';
import fetchMock from 'fetch-mock/cjs/client';
import type { MockResponseObject } from 'fetch-mock/types';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { VRTestWrapper } from './utils/vr-test';
import LozengeAction from '../src/view/FlexibleCard/components/common/lozenge-action';
import { SmartLinkActionType } from '@atlaskit/linking-types/smart-link-actions';

const params =
  typeof URLSearchParams !== 'undefined'
    ? new URLSearchParams(location.search.slice(1))
    : null;
const delay = params ? params.get('delay') : 0;

fetchMock.mock({
  delay, // delay for snapshot
  matcher: '/gateway/api/object-resolver/invoke ',
  method: 'POST',
  name: 'invoke',
  overwriteRoutes: true,
  response: (url: string, options: MockResponseObject) => {
    const body = JSON.parse((options?.body as string) ?? '{}');
    switch (body.action.actionType) {
      case SmartLinkActionType.GetStatusTransitionsAction:
        return {
          transitions: [
            { id: '1', name: 'In Progress', appearance: 'inprogress' },
            { id: '2', name: 'Done', appearance: 'success' },
            { id: '3', name: 'To Do', appearance: 'default' },
            { id: '4', name: 'Explore' },
            { id: '5', name: 'In Review', appearance: 'inprogress' },
          ],
        };
      case SmartLinkActionType.StatusUpdateAction:
        return 204;
      default:
        return 200;
    }
  },
});

const action = {
  read: {
    action: {
      actionType: SmartLinkActionType.GetStatusTransitionsAction,
      resourceIdentifiers: {
        issueId: 'some-id',
        hostname: 'some-hostname',
      },
    },
    providerKey: 'object-provider',
  },
  update: {
    action: {
      actionType: SmartLinkActionType.StatusUpdateAction,
      resourceIdentifiers: {
        issueId: 'some-id',
        hostname: 'some-hostname',
      },
    },
    providerKey: 'object-provider',
  },
};

export default () => (
  <VRTestWrapper title="Action: Lozenge">
    <SmartCardProvider>
      <LozengeAction
        text="To Do"
        action={action}
        testId="vr-test-lozenge-action"
      />
    </SmartCardProvider>
  </VRTestWrapper>
);
