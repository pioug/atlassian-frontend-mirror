import React from 'react';

import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { ProfileCard } from '../src';
import { profiles } from '../src/mocks';
import { reportingLinesData } from '../src/mocks/reporting-lines-data';

import ExampleWrapper from './helper/example-wrapper';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const MainStage = styled.div({
  margin: token('space.200', '16px'),
});

const avatarImage = profiles[4].User.avatarUrl;

export default function Example() {
  return (
    <ExampleWrapper>
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
          reportingLines={reportingLinesData}
          reportingLinesProfileUrl="/"
          onReportingLinesClick={(user) => {
            console.log('Clicked on ' + user.pii?.name);
          }}
        />
      </MainStage>
    </ExampleWrapper>
  );
}
