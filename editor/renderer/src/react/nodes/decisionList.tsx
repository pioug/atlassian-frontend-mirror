import React from 'react';
import { PureComponent, Children } from 'react';

import { DecisionList as AkDecisionList } from '@atlaskit/task-decision';

export interface Props {
  children?: JSX.Element | JSX.Element[];
}

export default class DecisionList extends PureComponent<Props, {}> {
  render() {
    const { children } = this.props;

    if (Children.count(children) === 0) {
      return null;
    }

    return <AkDecisionList>{children}</AkDecisionList>;
  }
}
