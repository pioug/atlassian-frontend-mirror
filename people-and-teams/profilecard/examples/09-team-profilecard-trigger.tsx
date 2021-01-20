import React, { useState } from 'react';
import styled from 'styled-components';
import ProfileCardClient from '../src/api/ProfileCardClient';

import { getMockTeamClient } from './helper/util';
import teamData from '../mock-helpers/team-data';
import LocaleIntlProvider from './helper/locale-intl-provider';
import TeamProfilecardTrigger from '../src/components/TeamProfileCardTrigger';
import { Radios, TeamCustomizer } from './helper/customization';
import { Team } from '../src/types';

const clientArgs = {
  cacheSize: 10,
  cacheMaxAge: 0,
  url: 'DUMMY',
};

const defaultTeamData = teamData({
  headerImage: 'Picture',
  members: 15,
});

const myTeamData = {
  ...defaultTeamData,
};

const teamClientData: {
  team: Team;
  timeout: number;
  error: any;
  errorRate: number;
} = {
  team: myTeamData,
  timeout: 500,
  error: {},
  errorRate: 0,
};

const MockTeamClient = getMockTeamClient(teamClientData);

const profileClient = new ProfileCardClient(clientArgs, {
  teamClient: new MockTeamClient(clientArgs),
});

export const MainStage = styled.div`
  margin: 16px;
`;

export const Section = styled.div`
  margin: 16px 0;

  h4 {
    margin: 8px 0;
  }
`;

const Container = styled.div`
  border: 1px solid #ccc;
  border-radius: 3px;
  margin: 8px;
  padding: 8px;
`;

const defaultProps = {
  teamId: '1',
  orgId: 'DUMMY',
  resourceClient: profileClient,
  actions: [
    {
      label: 'Secondary',
      callback: () => {},
      link: 'about:blank',
    },
    {
      label: 'Option with callback',
      callback: () => alert('First option clicked'),
    },
    {
      label: 'Option with link',
      link: 'about:blank',
    },
    {
      label: 'Option with both',
      callback: () => alert('Third option clicked'),
      link: 'about:blank',
    },
  ],
  viewProfileLink: 'about:blank',
  viewProfileOnClick: () => alert('Viewing profile.'),
};

function CustomizationPanel() {
  const [timeout, setTimeout] = useState(500);
  const [errorRate, setErrorRate] = useState(0);

  return (
    <MainStage>
      Timeout
      <Radios
        label="timeout"
        options={[0, 100, 500, 1000, 3000, 10000]}
        setter={value => {
          setTimeout(value);
          teamClientData.timeout = value;
        }}
        currentValue={timeout}
      />
      Error rate
      <Radios
        label="errorRate"
        options={[0, 0.2, 0.5, 0.8, 1]}
        setter={value => {
          setErrorRate(value);
          teamClientData.errorRate = value;
        }}
        currentValue={errorRate}
      />
    </MainStage>
  );
}

export default function Example() {
  const [includingYou, setIncludingYou] = useState(false);

  const viewerId = includingYou ? teamClientData.team.members![0]?.id : '';

  return (
    <LocaleIntlProvider>
      <MainStage>
        <Section>
          <input value="Value" type="text" />
          <Container>
            <h4>Profilecard triggered by hover</h4>
            <span>
              Hover to preview the team:{' '}
              <TeamProfilecardTrigger
                {...defaultProps}
                trigger="hover"
                viewingUserId={viewerId}
              >
                <strong>The Cool Team</strong>
              </TeamProfilecardTrigger>
            </span>
          </Container>
          <Container>
            <h4>Profilecard triggered by click</h4>
            <span>
              Click on them to preview:{' '}
              <TeamProfilecardTrigger
                {...defaultProps}
                trigger="click"
                viewingUserId={viewerId}
              >
                <strong>The Nice Team</strong>
              </TeamProfilecardTrigger>
            </span>
          </Container>
          <Container>
            <h4>Profilecard triggered by hover or click</h4>
            <span>
              Click on them to preview:{' '}
              <TeamProfilecardTrigger
                {...defaultProps}
                trigger="hover-click"
                viewingUserId={viewerId}
              >
                <strong>The Hover-Clicky Team</strong>
              </TeamProfilecardTrigger>
            </span>
            <p>
              This will try to be "smart" to determine whether to close
              correctly on mousing away or not.
            </p>
          </Container>
        </Section>
        <CustomizationPanel />
        <p>
          Including you?
          <label htmlFor="includingYou">
            <input
              checked={includingYou}
              id="includingYou"
              onChange={() => setIncludingYou(!includingYou)}
              type="checkbox"
            />
            {includingYou}
          </label>
        </p>
        <TeamCustomizer
          setTeam={team => {
            teamClientData.team = team;
          }}
        />
      </MainStage>
    </LocaleIntlProvider>
  );
}
