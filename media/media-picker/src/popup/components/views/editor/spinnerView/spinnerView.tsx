import React from 'react';
import { Component } from 'react';
import Spinner from '@atlaskit/spinner';

import { EscHelper } from '../escHelper';
import { CenterView } from '../styles';

export interface SpinnerViewProps {
  readonly onCancel: () => void;
}

export class SpinnerView extends Component<SpinnerViewProps> {
  private escHelper?: EscHelper;

  componentDidMount() {
    this.escHelper = new EscHelper(this.props.onCancel);
  }

  componentWillUnmount() {
    if (this.escHelper) {
      this.escHelper.teardown();
    }
  }

  render() {
    return (
      <CenterView>
        <Spinner size="large" appearance="invert" />
      </CenterView>
    );
  }
}
