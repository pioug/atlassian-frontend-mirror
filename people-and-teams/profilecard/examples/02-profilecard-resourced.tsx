import React, { useState } from 'react';

import styled from 'styled-components';

import Button, { ButtonGroup } from '@atlaskit/button';

import ProfileCardResourced from '../src';

import LocaleIntlProvider from './helper/locale-intl-provider';
import { getMockProfileClient } from './helper/util';

export const Wrap = styled.div`
  margin-bottom: 20px;
`;

export const MainStage = styled.div`
  margin: 16px;
`;

const mockClient = getMockProfileClient(10, 0);
// With a real client this would look like:
// const client = new ProfileClient({ url: 'http://api/endpoint' });

const defaultProps = {
  cloudId: 'dummy-cloud',
  resourceClient: mockClient,
  actions: [
    {
      label: 'View profile',
      id: 'view-profile',
      callback: () => {},
    },
  ],
};

export default function Example() {
  const [actions, setActions] = useState(defaultProps.actions);
  const [resourceClient, setResourceClient] = useState(
    defaultProps.resourceClient,
  );

  const handleChangeActions = () => {
    setActions([
      {
        label: 'View profile - ' + Date.now(),
        id: 'view-profile - ' + Date.now(),
        callback: () => {},
      },
    ]);
  };

  const handleChangeResourceClient = () => {
    setResourceClient(getMockProfileClient(10, 0));
  };

  return (
    <LocaleIntlProvider>
      <MainStage>
        <Wrap>
          <ButtonGroup>
            {/* Check re-rederning Profile Card when `actions` is changed */}
            <Button onClick={handleChangeActions}>
              Update "actions" props
            </Button>
            {/* Check re-fetching data when `resourceClient` is changed */}
            <Button onClick={handleChangeResourceClient}>
              Update "resourceClient" props
            </Button>
          </ButtonGroup>
        </Wrap>

        <Wrap>
          <ProfileCardResourced
            {...defaultProps}
            userId="1"
            actions={actions}
            resourceClient={resourceClient}
          />
        </Wrap>
        <br />
        <Wrap>
          <ProfileCardResourced
            {...defaultProps}
            userId="2"
            actions={actions}
            resourceClient={resourceClient}
          />
        </Wrap>
        <br />
        <Wrap>
          <ProfileCardResourced
            {...defaultProps}
            userId="error:NotFound"
            actions={actions}
            resourceClient={resourceClient}
          />
        </Wrap>
      </MainStage>
    </LocaleIntlProvider>
  );
}
