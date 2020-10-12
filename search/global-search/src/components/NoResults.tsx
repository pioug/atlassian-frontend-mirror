import React from 'react';
import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';
import NoResultsImage from '../assets/NoResultsImage';

const NoResultsWrapper = styled.div`
  text-align: center;
  margin-top: ${math.multiply(gridSize, 15)}px;
  margin-bottom: 0;
`;

export interface Props {
  title: JSX.Element | string;
  body?: JSX.Element | string;
}

export default class NoResults extends React.Component<Props> {
  render() {
    const { title, body } = this.props;
    return (
      <NoResultsWrapper>
        <NoResultsImage />
        <h3>{title}</h3>
        {body && <p>{body}</p>}
      </NoResultsWrapper>
    );
  }
}
