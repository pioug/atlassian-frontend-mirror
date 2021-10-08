import React from 'react';

import styled from 'styled-components';

import { ProfileCard } from '../src';
import { profiles } from '../src/mocks';

import LocaleIntlProvider from './helper/locale-intl-provider';

export const MainStage = styled.div`
  margin: 16px;
`;

const avatarImage = profiles[4].User.avatarUrl;

export default function Example() {
  return (
    <LocaleIntlProvider>
      <>
        <MainStage>
          <ProfileCard
            avatarUrl={avatarImage}
            fullName="Link card"
            meta="With callback"
            actions={[
              {
                label: 'View website',
                id: 'view-website',
                callback: () => {
                  alert('Click action performed');
                },
                link: 'https://www.atlassian.com',
              },
            ]}
          />
        </MainStage>
        <MainStage>
          <ProfileCard
            avatarUrl={avatarImage}
            fullName="Link card"
            meta="Without callback"
            actions={[
              {
                label: 'View website',
                id: 'view-website',
                link: 'https://www.atlassian.com',
              },
            ]}
          />
        </MainStage>
      </>
    </LocaleIntlProvider>
  );
}
