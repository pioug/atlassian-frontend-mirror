import React from 'react';

import styled from 'styled-components';

import { ProfileCard } from '../src';
import { profiles } from '../src/mocks';
import { ProfilecardProps } from '../src/types';

import LocaleIntlProvider from './helper/locale-intl-provider';

export const MainStage = styled.div`
  margin: 16px;
`;

export const Section = styled.div`
  margin: 16px 0;

  h4 {
    margin: 8px 0;
  }
`;

const fakeProfileData = {
  avatarUrl: profiles[4].User.avatarUrl,
  fullName: profiles[4].User.fullName,
  nickname: profiles[4].User.nickname,
  email: profiles[4].User.email,
  location: 'Sydney, Australia',
  timestring: '9:00am',
  meta: profiles[4].User.meta,
  actions: [
    {
      label: 'View profile',
      id: 'view-profile',
      callback: () => {},
    },
  ],
};

const fakeData = (data = {}): ProfilecardProps => {
  const newData = {
    ...fakeProfileData,
    ...data,
  };

  // filter out null values from fake data object
  return (
    Object.keys(newData)
      // @ts-ignore
      .filter((key) => Boolean(newData[key]))
      .reduce((result, item) => {
        return {
          ...result,
          // @ts-ignore
          [item]: newData[item],
        };
      }, {})
  );
};

const bestCaseProfile = fakeData();

const worstCaseProfile = fakeData({
  avatarUrl: null,
  meta: null,
  timestring: null,
  location: null,
});

const botCaseProfile = fakeData({
  fullName: 'Awesome Thing Bot',
  nickname: 'awesomebot',
  isBot: true,
});

const actions = [
  {
    label: 'Foobar',
    id: 'action-foo',
    callback: () => {},
  },
  {
    label: 'Barfoo',
    id: 'action-barfoo',
    callback: () => {},
  },
  {
    label: 'Foobar2',
    id: 'action-footwo',
    callback: () => {},
  },
];

export default function Example() {
  return (
    <LocaleIntlProvider>
      <MainStage>
        <Section>
          <h4>Loading State</h4>
          <ProfileCard isLoading />
        </Section>
        <Section>
          <h4>Error State</h4>
          <ProfileCard hasError />
        </Section>
        <Section>
          <h4>Error State (Not Found Error)</h4>
          <ProfileCard
            hasError
            errorType={{
              reason: 'NotFound',
            }}
          />
        </Section>
        <Section>
          <h4>Worst case</h4>
          <ProfileCard {...worstCaseProfile} />
        </Section>
        <Section>
          <h4>Best case</h4>
          <ProfileCard {...bestCaseProfile} />
        </Section>
        <Section>
          <h4>Bot case</h4>
          <ProfileCard {...botCaseProfile} />
        </Section>
        <Section>
          <h4>Alternate actions</h4>
          <ProfileCard {...fakeData({ actions })} />
        </Section>
      </MainStage>
    </LocaleIntlProvider>
  );
}
