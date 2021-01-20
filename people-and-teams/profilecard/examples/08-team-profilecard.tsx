import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import sample from 'lodash/sample';
import { Radios, TeamCustomizer } from './helper/customization';
import { TeamProfileCard } from '../src';
import LocaleIntlProvider from './helper/locale-intl-provider';
import teamData from '../mock-helpers/team-data';

export const MainStage = styled.div`
  margin: 16px;
`;

const CardWrapper = styled.div`
  display: inline-block;
  border: 1px solid black;
  border-radius: 3px;
`;

const props = {
  team: teamData({}),
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
};

const actionCounts = [0, 1, 2, 3, 4];

export default function Example() {
  const [numActions, setNumActions] = useState(1);

  useEffect(() => {
    setNumActions(sample(actionCounts)!);
  }, []);

  const [isLoading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [includingYou, setIncludingYou] = useState(false);

  const [team, setTeam] = useState(teamData({}));

  const actions = props.actions.slice(0, numActions);

  return (
    <LocaleIntlProvider>
      <div>
        <MainStage>
          <CardWrapper>
            <TeamProfileCard
              generateUserLink={() => 'about:blank'}
              hasError={hasError}
              isLoading={isLoading}
              team={team}
              actions={actions}
              clientFetchProfile={() => {
                console.log('Trying to refetch');
              }}
              viewingUserId={includingYou ? team.members![0]?.id : ''}
              viewProfileLink="about:blank"
              viewProfileOnClick={() => alert('Viewing profile.')}
            />
          </CardWrapper>
        </MainStage>
        <MainStage>
          <TeamCustomizer setTeam={setTeam} />
          Actions
          <Radios
            label="actions"
            options={actionCounts}
            setter={setNumActions}
            currentValue={numActions}
          />
          <p>
            isLoading
            <label htmlFor="isLoading">
              <input
                checked={isLoading}
                id="isLoading"
                onChange={() => setLoading(!isLoading)}
                type="checkbox"
              />
              {isLoading}
            </label>
          </p>
          <p>
            hasError
            <label htmlFor="hasError">
              <input
                checked={hasError}
                id="hasError"
                onChange={() => setHasError(!hasError)}
                type="checkbox"
              />
              {hasError}
            </label>
          </p>
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
        </MainStage>
      </div>
    </LocaleIntlProvider>
  );
}
