import React, { PureComponent } from 'react';
import { colors } from '@atlaskit/theme';
import { Link, BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import { ProgressTracker, Stage, Stages } from '../src';

const items: Stages = [
  {
    id: 'disabled-1',
    label: 'Disabled Step',
    percentageComplete: 100,
    status: 'disabled',
  },
  {
    id: 'visited-1',
    label: 'Visited Step',
    percentageComplete: 100,
    status: 'visited',
    href: '#',
  },
  {
    id: 'current-1',
    label: 'Current Step',
    percentageComplete: 0,
    status: 'current',
  },
  {
    id: 'unvisited-1',
    label: 'Unvisited Step 1',
    percentageComplete: 0,
    status: 'unvisited',
  },
  {
    id: 'unvisited-2',
    label: 'Unvisited Step 2',
    percentageComplete: 0,
    status: 'unvisited',
  },
  {
    id: 'unvisited-3',
    label: 'Unvisited Step 3',
    percentageComplete: 0,
    status: 'unvisited',
  },
];

interface Props {
  /** stage data passed to each `ProgressTrackerStage` component */
  item: Stage;
}

const StyledLink = styled(Link)`
  color: ${colors.N800};
`;

class CustomProgressTrackerLink extends PureComponent<Props> {
  render() {
    const { href = '', label } = this.props.item;
    return <StyledLink to={href}>{label}</StyledLink>;
  }
}

const render = {
  link: (props: Props) => <CustomProgressTrackerLink {...props} />,
};

export default () => (
  <BrowserRouter>
    <ProgressTracker items={items} render={render} />
  </BrowserRouter>
);
