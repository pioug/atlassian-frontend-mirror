import React, { PureComponent } from 'react';
import { Link } from './styled';
import { Stage } from '../types';

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
