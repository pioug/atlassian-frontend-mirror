import React from 'react';
import { Provider } from '../../src';
import VRTestWrapper from '../utils/vr-test-wrapper';
import { getMockForbiddenDirectAccessResponse } from '../../src/view/HoverCard/__tests__/__mocks__/mocks';
import { CardProviderStoreOpts } from '@atlaskit/link-provider';
import { HoverCardComponent } from '../../src/view/HoverCard/components/HoverCardComponent';

const mockUrl = 'https://www.mockurl.com';

const getStoreOptions = (accessType: string): CardProviderStoreOpts => ({
  initialState: {
    [mockUrl]: {
      status: 'forbidden',
      lastUpdatedAt: 1624877833614,
      details: getMockForbiddenDirectAccessResponse(accessType),
    },
  },
});

const ForbiddenHoverCard = ({ accessType = '' }) => {
  return (
    <Provider storeOptions={getStoreOptions(accessType)}>
      <HoverCardComponent url={mockUrl} noFadeDelay={true}>
        <button data-testid={accessType}>{accessType}</button>
      </HoverCardComponent>
    </Provider>
  );
};

export default () => (
  <VRTestWrapper>
    <ForbiddenHoverCard accessType="DIRECT_ACCESS" />
    <ForbiddenHoverCard accessType="REQUEST_ACCESS" />
    <ForbiddenHoverCard accessType="PENDING_REQUEST_EXISTS" />
    <ForbiddenHoverCard accessType="DENIED_REQUEST_EXISTS" />
    <ForbiddenHoverCard accessType="ACCESS_EXISTS" />
    <ForbiddenHoverCard accessType="FORBIDDEN" />
  </VRTestWrapper>
);
