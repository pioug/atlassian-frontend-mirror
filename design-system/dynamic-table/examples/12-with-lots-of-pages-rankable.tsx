import React from 'react';
import styled from 'styled-components';
import { ToggleStateless as Toggle } from '@atlaskit/toggle';
import DynamicTable from '../src';
import { caption, createHead, rows } from './content/sample-data';

const Wrapper = styled.div`
  min-width: 600px;
`;

interface State {
  isFixedSize: boolean;
  isLoading: boolean;
}

export default class extends React.Component<{}, State> {
  state = {
    isFixedSize: false,
    isLoading: false,
  };

  onToggleFixedChange = () => {
    this.setState({
      isFixedSize: !this.state.isFixedSize,
    });
  };

  onLoadingChange = () => {
    this.setState({
      isLoading: !this.state.isLoading,
    });
  };

  render() {
    return (
      <Wrapper>
        <div>
          <Toggle
            onChange={this.onToggleFixedChange}
            isChecked={this.state.isFixedSize}
          />
          Fixed size
        </div>
        <div>
          <Toggle
            onChange={this.onLoadingChange}
            isChecked={this.state.isLoading}
          />
          Loading
        </div>
        <DynamicTable
          caption={caption}
          head={createHead(this.state.isFixedSize)}
          rows={rows}
          rowsPerPage={5}
          defaultPage={1}
          isRankable
          isLoading={this.state.isLoading}
          onRankStart={params => console.log('onRankStart', params)}
          onRankEnd={params => console.log('onRankEnd', params)}
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
        <p>This example works properly only in fullscreen mode.</p>
      </Wrapper>
    );
  }
}
