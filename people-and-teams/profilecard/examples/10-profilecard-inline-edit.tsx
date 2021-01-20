import React, { useState } from 'react';

// Whaaaa
import styled from 'styled-components';

import Select, { ValueType } from '@atlaskit/select';
import { gridSize } from '@atlaskit/theme/constants';

import teamData from '../mock-helpers/team-data';
import TeamProfileCardClient from '../src/api/TeamProfileCardClient';
import { Team } from '../src/types';
import ProfileCardClient from '../src/api/ProfileCardClient';
import TeamProfilecardTrigger from '../src/components/TeamProfileCardTrigger';

import InlineEdit from '@atlaskit/inline-edit';

const EditViewContainer = styled.div`
  z-index: 300;
  position: relative;
`;

const Container = styled.div`
  border: 1px solid #ccc;
  border-radius: 3px;
  margin: 8px;
  padding: 8px;
`;

const teams: Record<string, Team> = {
  'Air-Guitar': {
    ...teamData({ members: 0, description: 'None' }),
    displayName: 'Air-Guitar',
    description: 'Guitarist peoples',
    largeHeaderImageUrl:
      'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/gradients/1.svg',
  },
  Bongos: {
    ...teamData({ members: 0, description: 'None' }),
    displayName: 'Bongos',
    description: 'Bongo players',
    largeHeaderImageUrl:
      'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/gradients/2.svg',
  },
  Clappers: {
    ...teamData({ members: 0, description: 'None' }),
    displayName: 'Clappers',
    description: 'People that clap',
    largeHeaderImageUrl:
      'https://ptc-directory-sited-static.us-east-1.prod.public.atl-paas.net/gradients/4.svg',
  },
};

interface OptionType {
  label: string;
  value: string;
}

const selectOptions: OptionType[] = [
  { label: 'Air-Guitar', value: 'Air-Guitar' },
  { label: 'Bongos', value: 'Bongos' },
  { label: 'Clappers', value: 'Clappers' },
];

class MockTeamClient extends TeamProfileCardClient {
  makeRequest(teamId: string): Promise<Team> {
    return Promise.resolve(teams[teamId] || teams.Bongos);
  }
}

const args = { cacheSize: 10, maxCacheAge: 0, url: 'DUMMY' };

const profileClient = new ProfileCardClient(args, {
  teamClient: new MockTeamClient(args),
});

function MiniEditor(props: {
  label: string;
  trigger: 'click' | 'hover' | 'hover-click';
}) {
  const [value, setValue] = useState<OptionType>(selectOptions[0]);

  const onConfirm = (value: ValueType<OptionType>) => {
    if (!value) {
      return;
    }

    setValue(value as OptionType);
  };

  return (
    <InlineEdit<ValueType<OptionType>>
      defaultValue={value}
      label={props.label}
      editView={fieldProps => (
        <EditViewContainer>
          <Select<OptionType>
            {...fieldProps}
            options={selectOptions}
            autoFocus
            openMenuOnClick
          />
        </EditViewContainer>
      )}
      readView={() => (
        <div
          style={{
            padding: `${gridSize()}px`,
            width: '300px',
            display: 'inline-block',
          }}
        >
          <TeamProfilecardTrigger
            orgId="DUMMY"
            resourceClient={profileClient}
            teamId={value.value}
            viewProfileLink="about:blank"
            trigger={props.trigger}
          >
            <strong>{value.label}</strong>
          </TeamProfilecardTrigger>
        </div>
      )}
      onConfirm={onConfirm}
    />
  );
}

export default function InlineEditExample() {
  return (
    <div
      style={{
        padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
      }}
    >
      <input value="Sample" type="text" />
      <button>Purely demo purposes</button>
      <div style={{ width: '600px' }}>
        <Container>
          <p>
            Hover only is fine for mouse users. Screen reader users trying to
            interact with the trigger get taken to the link.
          </p>
          <p>Generally not the recommended type of trigger.</p>
          <MiniEditor label="Assigned team (hover only)" trigger="hover" />
        </Container>
        <Container>
          <p>
            Click only doesn't work <i>here</i> for mouse users as clicking
            opens the inline edit. Pressing enter works well for screen reader
            users.
          </p>
          <p>
            Generally preferred if clicking to interact works for your use case.
          </p>
          <MiniEditor label="Assigned team (click only)" trigger="click" />
        </Container>
        <Container>
          <p>
            Hover works well here for mouse users. Screen reader users can also
            interact with the trigger to open the profile card.
          </p>
          <p>
            Ideal if mouse users are not able to click to open the profile card.
          </p>
          <MiniEditor
            label="Assigned team (click + hover)"
            trigger="hover-click"
          />
        </Container>
      </div>
    </div>
  );
}
