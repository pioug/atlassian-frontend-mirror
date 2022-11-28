import React, { PureComponent } from 'react';

import { BrowserRouter, Link } from 'react-router-dom';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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

interface CustomProgressTrackerLinkProps {
  /**
   * stage data passed to each `ProgressTrackerStage` component
   */
  item: Stage;
}

class CustomProgressTrackerLink extends PureComponent<CustomProgressTrackerLinkProps> {
  render() {
    const { href = '', label } = this.props.item;
    return (
      <Link style={{ color: token('color.text', N800) }} to={href}>
        {label}
      </Link>
    );
  }
}

const render = {
  link: (props: CustomProgressTrackerLinkProps) => (
    <CustomProgressTrackerLink {...props} />
  ),
};

export default () => (
  <BrowserRouter>
    <ProgressTracker items={items} render={render} />
  </BrowserRouter>
);
