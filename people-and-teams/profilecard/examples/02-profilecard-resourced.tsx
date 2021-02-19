import React from 'react';

import styled from 'styled-components';

import ProfileCardResourced from '../src';

import LocaleIntlProvider from './helper/locale-intl-provider';
import { analyticsHandler, getMockProfileClient } from './helper/util';

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
  analytics: analyticsHandler,
  actions: [
    {
      label: 'View profile',
      id: 'view-profile',
      callback: () => {},
    },
  ],
};

export default function Example() {
  return (
    <LocaleIntlProvider>
      <MainStage>
        <Wrap>
          <ProfileCardResourced {...defaultProps} userId="1" />
        </Wrap>
        <br />
        <Wrap>
          <ProfileCardResourced {...defaultProps} userId="2" />
        </Wrap>
        <br />
        <Wrap>
          <ProfileCardResourced {...defaultProps} userId="error:NotFound" />
        </Wrap>
      </MainStage>
    </LocaleIntlProvider>
  );
}
