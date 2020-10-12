import React from 'react';
import styled from 'styled-components';
import ProfileCardResourced from '../src';
import { getMockProfileClient, analyticsHandler } from './helper/util';
import LocaleIntlProvider from './helper/locale-intl-provider';

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
        <ProfileCardResourced {...defaultProps} userId="1" />
        <br />
        <ProfileCardResourced {...defaultProps} userId="2" />
        <br />
        <ProfileCardResourced {...defaultProps} userId="error:NotFound" />
      </MainStage>
    </LocaleIntlProvider>
  );
}
