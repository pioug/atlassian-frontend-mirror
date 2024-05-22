import React from 'react';

import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { ProfileCard } from '../src';
import { profiles } from '../src/mocks';

import ExampleWrapper from './helper/example-wrapper';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MainStage = styled.div({
  margin: token('space.200', '16px'),
});

const avatarImage = profiles[4].User.avatarUrl;

export default function Example() {
  return (
    <ExampleWrapper>
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
    </ExampleWrapper>
  );
}
