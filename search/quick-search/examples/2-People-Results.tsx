import React from 'react';
import Avatar from '@atlaskit/avatar';
import { getPersonAvatarUrl } from './utils/mockData';
import { PersonResult, ResultItemGroup } from '../src';

const defaultProps = {
  resultId: 'result_id',
};

const dummyAvatarComponent = (
  <Avatar src={getPersonAvatarUrl('wowowow')} appearance="square" />
);

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component {
  render() {
    return (
      <div>
        <h3>People</h3>
        <p>
          People results have circular avatar and a name. They can optionally
          display a mention handle and presence.
        </p>

        <ResultItemGroup title="People examples">
          <PersonResult
            {...defaultProps}
            avatarUrl={getPersonAvatarUrl('owkenobi')}
            mentionName="BenKen"
            name="Obi Wan Kenobi"
            presenceState="online"
          />
          <PersonResult
            {...defaultProps}
            avatarUrl={getPersonAvatarUrl('qgjinn')}
            mentionName="MasterQ"
            name="Qui-Gon Jinn"
            presenceMessage="On-call"
            presenceState="offline"
          />
          <PersonResult
            {...defaultProps}
            avatarUrl={getPersonAvatarUrl('sidious')}
            mentionName="TheEmperor"
            mentionPrefix="#"
            name="Palpatine"
            presenceMessage="Custom mention prefix"
            presenceState="busy"
          />
          <PersonResult
            {...defaultProps}
            avatar={dummyAvatarComponent}
            mentionName="TheAvatarGod"
            mentionPrefix="#"
            name="David Soundararaj"
            presenceMessage="@dteen"
            presenceState="online"
          />
          <PersonResult
            {...defaultProps}
            key="4"
            name="Minimum detail person"
          />
        </ResultItemGroup>
      </div>
    );
  }
}
