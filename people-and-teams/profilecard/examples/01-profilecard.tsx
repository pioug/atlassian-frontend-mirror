import React from 'react';
import styled from 'styled-components';
import { profiles } from '../mock-helpers/index';
import { ProfileCard } from '../src';
import LocaleIntlProvider from './helper/locale-intl-provider';

export const MainStage = styled.div`
  margin: 16px;
`;

const avatarImage = profiles[4].User.avatarUrl;

export default function Example() {
  return (
    <LocaleIntlProvider>
      <MainStage>
        <ProfileCard
          avatarUrl={avatarImage}
          fullName="Rosalyn Franklin"
          meta="Manager"
          nickname="rfranklin"
          email="rfranklin@acme.com"
          timestring="18:45"
          location="Somewhere, World"
          actions={[
            {
              label: 'View profile',
              id: 'view-profile',
              callback: () => {},
            },
          ]}
        />
      </MainStage>
    </LocaleIntlProvider>
  );
}
