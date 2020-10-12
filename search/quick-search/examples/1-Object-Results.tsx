import React from 'react';
import Avatar from '@atlaskit/avatar';
import { randomJiraIconUrl, randomConfluenceIconUrl } from './utils/mockData';
import { ObjectResult, ResultItemGroup } from '../src';

const defaultProps = {
  resultId: 'result_id',
};

const dummyAvatarComponent = (
  <Avatar src={randomConfluenceIconUrl()} appearance="square" />
);

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component {
  render() {
    return (
      <div>
        <h3>Objects</h3>
        <p>
          Like containers, objects have square avatars and a name and can be
          marked as private, however, instead of a free subText field, they
          display the name of their containing entity. They can optionally
          display an object key.
        </p>

        <ResultItemGroup title="Object examples">
          <ObjectResult
            {...defaultProps}
            name="quick-search is too hilarious!"
            avatarUrl={randomJiraIconUrl()}
            objectKey="AK-007"
            containerName="Search'n'Smarts"
          />
          <ObjectResult
            {...defaultProps}
            avatarUrl={randomConfluenceIconUrl()}
            name="Yeah, I cut my dev loop in half, but you'll never guess what happened next!"
            containerName="Buzzfluence"
          />
          <ObjectResult
            {...defaultProps}
            avatarUrl={randomConfluenceIconUrl()}
            name="Prank schedule: April 2017"
            containerName="The Scream Team"
            isPrivate
          />
          <ObjectResult
            {...defaultProps}
            avatar={dummyAvatarComponent}
            name="This one has an avatar component!"
            containerName="The Scream Team"
            isPrivate
          />
        </ResultItemGroup>
      </div>
    );
  }
}
