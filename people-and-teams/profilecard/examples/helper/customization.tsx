import React, { useEffect, useState } from 'react';

import sample from 'lodash/sample';

import teamData from '../../src/mocks/team-data';
import { Team } from '../../src/types';

export function Radios<T extends { toString(): string }>({
  label,
  options,
  setter,
  currentValue,
}: {
  label: string;
  options: T[];
  setter: (val: T) => void;
  currentValue: T;
}) {
  return (
    <ul>
      {options.map((value) => {
        return (
          <label htmlFor={`${label}-${value}`} key={value.toString()}>
            <input
              checked={currentValue === value}
              id={`${label}-${value}`}
              onChange={() => setter(value)}
              type="radio"
            />
            {value.toString()}
          </label>
        );
      })}
    </ul>
  );
}

type NameKey = 'Short' | 'Medium' | 'Long' | 'Overlong';
type DescKey = 'None' | NameKey;

const descriptionKeys: DescKey[] = [
  'None',
  'Short',
  'Medium',
  'Long',
  'Overlong',
];
const memberCounts = [0, 1, 2, 3, 6, 7, 8, 9, 10, 11, 16, 22];
const nameKeys: NameKey[] = ['Short', 'Medium', 'Long', 'Overlong'];

export function TeamCustomizer({ setTeam }: { setTeam: (team: Team) => void }) {
  const [numMembers, setNumMembers] = useState(1);
  const [descSize, setDescription] = useState<DescKey>('Long');
  const [useHeader, setHeader] = useState(false);
  const [name, setName] = useState<NameKey>('Short');

  useEffect(() => {
    setNumMembers(sample(memberCounts)!);
    setDescription(sample(descriptionKeys)!);
    setHeader(sample([true, false])!);
    setName(sample(nameKeys)!);
  }, []);

  useEffect(() => {
    const team = teamData({
      headerImage: useHeader ? 'Picture' : 'None',
      displayName: name,
      members: numMembers,
      description: descSize,
    });

    setTeam(team);
  }, [descSize, name, numMembers, setTeam, useHeader]);

  return (
    <div>
      Header
      <Radios
        label="header"
        options={[true, false]}
        setter={setHeader}
        currentValue={useHeader}
      />
      Team name
      <Radios
        label="team-name"
        options={nameKeys}
        setter={setName}
        currentValue={name}
      />
      Members
      <Radios
        label="members"
        options={memberCounts}
        setter={setNumMembers}
        currentValue={numMembers}
      />
      Description
      <Radios
        label="description"
        options={descriptionKeys}
        setter={setDescription}
        currentValue={descSize}
      />
    </div>
  );
}
