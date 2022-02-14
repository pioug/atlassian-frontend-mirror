/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import Spinner from '@atlaskit/spinner';

import CommonCell from './common-cell';
import { LoaderItemContainer, TreeRowContainer } from './styled';

interface LoaderItemProps {
  depth: number;
  onComplete: (...args: any[]) => void;
  isCompleting?: boolean;
}

export default class LoaderItem extends Component<LoaderItemProps, any> {
  static defaultProps = {
    depth: 1,
  };

  state = {
    phase: 'loading',
  };

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.isCompleting && prevState.phase === 'loading') {
      return {
        phase: 'complete',
      };
    }
    return null;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.phase === 'loading' && this.state.phase === 'complete') {
      if (this.props.onComplete) {
        this.props.onComplete();
      }
    }
  }

  render() {
    const { depth } = this.props;
    const { phase } = this.state;
    return phase === 'loading' ? (
      <TreeRowContainer>
        <CommonCell indent={`${25 * depth}px`} width="100%">
          <LoaderItemContainer isRoot={depth === 1}>
            <Spinner size="small" />
          </LoaderItemContainer>
        </CommonCell>
      </TreeRowContainer>
    ) : null;
  }
}
