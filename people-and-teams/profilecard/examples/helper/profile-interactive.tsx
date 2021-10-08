import React, { Component } from 'react';

import styled, {
  ThemeProvider as StyledThemeProvider,
} from 'styled-components';
// @ts-ignore
import uid from 'uid';

import { N0, N800 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import DeprecatedThemeProvider from '@atlaskit/theme/deprecated-provider-please-do-not-use';

import { ProfileCard } from '../../src';
import { profiles } from '../../src/mocks';
import {
  LozengeProps,
  StatusModifiedDateType,
  StatusType,
} from '../../src/types';

const StoryWrapper = styled.div`
  label {
    color: ${themed({ light: N800, dark: N0 })};
    margin-right: 10px;
    -webkit-user-select: none;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    float: left;
  }
`;

const ProfileCardWrapper = styled.div`
  height: 340px;
`;

const handleActionClick = (title: string) => () => {
  console.log(`${title} button clicked`);
};

const getTimeString = (showWeekday: boolean = false) => {
  return showWeekday ? 'Thu 9:56am' : '9:56am';
};

const exampleLozenges: LozengeProps[] = [
  { text: 'Guest', appearance: 'new', isBold: true },
  { text: 'Cool Bean', appearance: 'removed' },
  { text: <div>Another Role</div>, appearance: 'inprogress', isBold: true },
];

type Props = {};

type State = {
  avatarUrl: string;
  email: string;
  fullName: string;
  nickname: string;
  companyName: string;
  meta: string;
  location: string;
  timeString: string;
  statusModifiedDate?: number;
  statusModifiedDateFieldName: StatusModifiedDateType;

  isBot: boolean;
  status: StatusType;

  hasDarkTheme: boolean;
  hasWeekday: boolean;
  hasAvatar: boolean;
  hasMeta: boolean;
  hasLocation: boolean;
  hasTime: boolean;
  hasCompanyName: boolean;
  hasLongName: boolean;
  hasLongRole: boolean;
  hasAltActions: boolean;
  hasNoActions: boolean;
  hasLoadingState: boolean;
  hasErrorState: boolean;
  hasDisabledAccountMessage: boolean;
  hasDisabledAccountLozenge: boolean;

  showCustomLozenge1: boolean;
  showCustomLozenge2: boolean;
  showCustomLozenge3: boolean;
};

export default class ProfilecardInteractive extends Component<Props, State> {
  state: State = {
    avatarUrl: profiles[4].User.avatarUrl,
    email: 'nlindsey@example.com',
    fullName: 'Natalie Lindsey',
    nickname: 'natalie',
    meta: 'Senior Developer',
    location: 'Sydney, Australia',
    companyName: 'Atlassian',
    timeString: getTimeString(),
    statusModifiedDate: undefined,
    statusModifiedDateFieldName: 'noDate',

    isBot: false,
    status: 'active',

    hasDarkTheme: false,
    hasWeekday: false,
    hasAvatar: true,
    hasMeta: true,
    hasLocation: true,
    hasCompanyName: true,
    hasTime: true,
    hasLongName: false,
    hasLongRole: false,
    hasAltActions: false,
    hasNoActions: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasDisabledAccountMessage: false,
    hasDisabledAccountLozenge: false,

    showCustomLozenge1: false,
    showCustomLozenge2: false,
    showCustomLozenge3: false,
  };

  actions = [
    {
      label: 'View profile',
      id: 'view-profile',
      callback: handleActionClick('View profile'),
    },
  ];

  createCheckboxBooleanAttribute(attribute: keyof State) {
    const id = `label-${uid()}`;
    return (
      <label htmlFor={id}>
        <input
          checked={Boolean(this.state[attribute])}
          id={id}
          onChange={() =>
            // @ts-ignore
            this.setState({ [attribute]: !this.state[attribute] })
          }
          type="checkbox"
        />
        {attribute}
      </label>
    );
  }

  createRadioStatusAttribute(attribute: StatusType) {
    const id = `label-${uid()}`;

    return (
      <label htmlFor={id}>
        <input
          checked={this.state.status === attribute}
          id={id}
          onChange={() => this.setState({ status: attribute })}
          type="radio"
        />
        {attribute}
      </label>
    );
  }

  createRadioStatusModifiedDate(attribute: StatusModifiedDateType) {
    const id = `label-${uid()}`;

    return (
      <label htmlFor={id}>
        <input
          checked={this.state.statusModifiedDateFieldName === attribute}
          id={id}
          onChange={() => {
            let dateTimeInMilliSeconds;
            const today = new Date();

            switch (attribute) {
              case 'thisWeek':
                // if `today.getDate() - 1` === 0, the last date of previous month is returned
                dateTimeInMilliSeconds = new Date(today).setDate(
                  today.getDate() - 1,
                );
                break;

              case 'thisMonth':
                // in case, today is 1st or 2st, so we can not render "this month" period
                // above periods can be displayed instead.
                dateTimeInMilliSeconds = new Date(today).setDate(1);
                break;

              case 'lastMonth':
                // if `today.getMonth() - 1` === -1, the last date of Dec of previous year is returned.
                dateTimeInMilliSeconds = new Date(today).setMonth(
                  today.getMonth() - 1,
                );
                break;

              case 'aFewMonths':
                dateTimeInMilliSeconds = new Date(today).setMonth(
                  today.getMonth() - 3,
                );
                break;

              case 'severalMonths':
                dateTimeInMilliSeconds = new Date(today).setMonth(
                  today.getMonth() - 7,
                );
                break;

              case 'moreThanAYear':
                dateTimeInMilliSeconds = new Date(today).setMonth(
                  today.getMonth() - 13,
                );
                break;

              default:
                dateTimeInMilliSeconds = undefined;
            }

            const dateTimeInSeconds = dateTimeInMilliSeconds
              ? dateTimeInMilliSeconds / 1000
              : undefined;

            return this.setState({
              statusModifiedDate: dateTimeInSeconds,
              statusModifiedDateFieldName: attribute,
            });
          }}
          type="radio"
        />
        {attribute}
      </label>
    );
  }

  createCustomLozengeArray(): LozengeProps[] | undefined {
    let customLozenges: LozengeProps[] | undefined;
    if (
      this.state.showCustomLozenge1 ||
      this.state.showCustomLozenge2 ||
      this.state.showCustomLozenge3
    ) {
      customLozenges = [];
      this.state.showCustomLozenge1 && customLozenges.push(exampleLozenges[0]);
      this.state.showCustomLozenge2 && customLozenges.push(exampleLozenges[1]);
      this.state.showCustomLozenge3 && customLozenges.push(exampleLozenges[2]);
    }
    return customLozenges;
  }

  render() {
    const customActions = [
      { label: 'Foo', id: 'foo', callback: handleActionClick('Foo') },
      { label: 'Bar', id: 'bar', callback: handleActionClick('Bar') },
      { label: 'Baz', id: 'baz', callback: handleActionClick('Baz') },
    ];

    const actions = this.state.hasAltActions ? customActions : this.actions;

    const meta = this.state.hasLongRole
      ? 'Sed do eiusmod tempor incididunt ut labore'
      : this.state.meta;

    /* eslint-disable max-len */
    return (
      <DeprecatedThemeProvider
        mode={this.state.hasDarkTheme ? 'dark' : 'light'}
        provider={StyledThemeProvider}
      >
        <StoryWrapper>
          <ProfileCardWrapper>
            <ProfileCard
              isLoading={this.state.hasLoadingState}
              hasError={this.state.hasErrorState}
              actions={this.state.hasNoActions ? [] : actions}
              isBot={this.state.isBot}
              status={this.state.status}
              statusModifiedDate={this.state.statusModifiedDate}
              avatarUrl={this.state.hasAvatar ? this.state.avatarUrl : ''}
              email={this.state.email}
              fullName={
                this.state.hasLongName
                  ? `${this.state.fullName} Hathaway ${this.state.fullName}`
                  : this.state.fullName
              }
              location={this.state.hasLocation ? this.state.location : ''}
              companyName={
                this.state.hasCompanyName ? this.state.companyName : ''
              }
              meta={this.state.hasMeta ? meta : ''}
              nickname={this.state.nickname}
              timestring={
                this.state.hasTime ? getTimeString(this.state.hasWeekday) : ''
              }
              clientFetchProfile={handleActionClick('Retry')}
              disabledAccountMessage={
                this.state.hasDisabledAccountMessage ? (
                  <React.Fragment>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <p>
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco
                      laboris nisi ut aliquip ex ea commodo.
                    </p>
                  </React.Fragment>
                ) : undefined
              }
              hasDisabledAccountLozenge={this.state.hasDisabledAccountLozenge}
              customLozenges={this.createCustomLozengeArray()}
            />
          </ProfileCardWrapper>

          <div style={{ marginTop: '16px', clear: 'both', overflow: 'auto' }}>
            <ul>
              <li>{this.createCheckboxBooleanAttribute('hasAvatar')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasAltActions')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasNoActions')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasMeta')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasLocation')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasCompanyName')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasTime')}</li>
            </ul>

            <ul>
              <li>{this.createCheckboxBooleanAttribute('hasLongName')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasLongRole')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasWeekday')}</li>
            </ul>

            <ul>
              <li>{this.createCheckboxBooleanAttribute('hasLoadingState')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasErrorState')}</li>
              <li>{this.createCheckboxBooleanAttribute('isBot')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasDarkTheme')}</li>
            </ul>

            <ul>
              <li>
                {this.createCheckboxBooleanAttribute('showCustomLozenge1')}
              </li>
              <li>
                {this.createCheckboxBooleanAttribute('showCustomLozenge2')}
              </li>
              <li>
                {this.createCheckboxBooleanAttribute('showCustomLozenge3')}
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '16px', clear: 'both', overflow: 'auto' }}>
            <ul>
              <li>{this.createRadioStatusAttribute('active')}</li>
              <li>{this.createRadioStatusAttribute('inactive')}</li>
              <li>{this.createRadioStatusAttribute('closed')}</li>
            </ul>

            <ul>
              <li>
                <strong>
                  These are applied when `status` is `inactive` or `closed`
                </strong>
              </li>
              <li>{this.createRadioStatusModifiedDate('noDate')}</li>
              <li>{this.createRadioStatusModifiedDate('thisWeek')}</li>
              <li>{this.createRadioStatusModifiedDate('thisMonth')}</li>
              <li>{this.createRadioStatusModifiedDate('lastMonth')}</li>
              <li>{this.createRadioStatusModifiedDate('aFewMonths')}</li>
              <li>{this.createRadioStatusModifiedDate('severalMonths')}</li>
              <li>{this.createRadioStatusModifiedDate('moreThanAYear')}</li>
              <li>
                {this.createCheckboxBooleanAttribute(
                  'hasDisabledAccountMessage',
                )}
              </li>
              <li>
                {this.createCheckboxBooleanAttribute(
                  'hasDisabledAccountLozenge',
                )}
              </li>
            </ul>
          </div>
        </StoryWrapper>
      </DeprecatedThemeProvider>
    );
  }
}
