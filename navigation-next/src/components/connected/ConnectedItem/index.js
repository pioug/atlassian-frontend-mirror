import React, { Component } from 'react';

import GoToItem from '../GoToItem';
import PresentationalItem from '../../presentational/Item';

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
