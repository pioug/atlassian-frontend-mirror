import React from 'react';
import { Component } from 'react';

import RendererDemo from './helper/RendererDemo';
import FieldRange from '@atlaskit/field-range';

interface State {
  fadeHeight: number;
  maxHeight: number;
}

export default class Example extends Component<{}, State> {
  constructor(props: object) {
    super(props);
    this.state = {
      fadeHeight: 24,
      maxHeight: 200,
    };
  }

  private onMaxHeightChange = (value: number) => {
    this.setState({
      maxHeight: value,
    });
  };

  private onFadeChange = (value: number) => {
    this.setState({
      fadeHeight: value,
    });
  };

  render() {
    return (
      <div>
        <div style={{ padding: 20, paddingBottom: 0 }}>
          <p>Max Height</p>
          <FieldRange
            value={this.state.maxHeight}
            min={0}
            max={300}
            onChange={this.onMaxHeightChange}
          />
          <p>FadeOut Height</p>
          <FieldRange
            value={this.state.fadeHeight}
            min={0}
            max={300}
            onChange={this.onFadeChange}
          />
        </div>
        <RendererDemo
          truncationEnabled={true}
          maxHeight={this.state.maxHeight}
          fadeOutHeight={this.state.fadeHeight}
          serializer="react"
        />
      </div>
    );
  }
}
