import React from 'react';
import Avatar from '@atlaskit/avatar';
import { getContainerAvatarUrl } from './utils/mockData';
import { ContainerResult, ResultItemGroup } from '../src';

const defaultProps = {
  resultId: 'result_id',
};

const dummyAvatarComponent = (
  <Avatar src={getContainerAvatarUrl(4)} appearance="square" />
);

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component {
  render() {
    return (
      <div>
        <h3>Containers</h3>
        <p>
          Containers have square avatars, can be marked as private and have a
          name and subText fields.
        </p>

        <ResultItemGroup title="Object examples">
          <ContainerResult
            {...defaultProps}
            avatarUrl={getContainerAvatarUrl(3)}
            name="Cargo boxes"
            subText="They're big!"
          />
          <ContainerResult
            {...defaultProps}
            isPrivate
            name="Private container"
          />
          <ContainerResult
            {...defaultProps}
            key="3"
            name="Minimum detail container"
          />
          <ContainerResult
            {...defaultProps}
            avatar={dummyAvatarComponent}
            key="4"
            name="With avatar component"
          />
        </ResultItemGroup>
      </div>
    );
  }
}
