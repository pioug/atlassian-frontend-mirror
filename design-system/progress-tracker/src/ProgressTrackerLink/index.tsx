import React, { PureComponent } from 'react';

import { Stage } from '../types';

import { Link } from './styled';

interface Props {
  /** stage data passed to each `ProgressTrackerStage` component */
  item: Stage;
}

export default class ProgressTrackerLink extends PureComponent<Props> {
  render() {
    const { href, onClick, label } = this.props.item;
    return (
      <Link href={href} onClick={onClick}>
        {label}
      </Link>
    );
  }
}
