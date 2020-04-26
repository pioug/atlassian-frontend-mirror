import React, { Component } from 'react';

import PresentationalItem from '../../presentational/Item';
import GoToItem from '../GoToItem';

export default class ConnectedItem extends Component {
  render() {
    const { after, ...props } = this.props;

    return this.props.goTo ? (
      <GoToItem {...props} after={after} />
    ) : (
      <PresentationalItem
        {...props}
        after={after === null ? undefined : after}
      />
    );
  }
}
