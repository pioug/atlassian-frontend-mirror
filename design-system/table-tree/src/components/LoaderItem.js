/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import Spinner from '@atlaskit/spinner';

import { Cell, LoaderItemContainer, TreeRowContainer } from '../styled';

export default class LoaderItem extends Component {
  static defaultProps = {
    depth: 1,
  };

  state = {
    phase: 'loading',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isCompleting && prevState.phase === 'loading') {
      return {
        phase: 'complete',
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.phase === 'loading' && this.state.phase === 'complete') {
      if (this.props.onComplete) {
        this.props.onComplete();
      }
    }
  }

  render() {
    const { isCompleting, depth } = this.props;
    const { phase } = this.state;
    return phase === 'loading' ? (
      <TreeRowContainer>
        <Cell indentLevel={depth} width="100%">
          <LoaderItemContainer isRoot={depth === 1}>
            <Spinner
              isCompleting={isCompleting}
              size="small"
              invertColor={false}
            />
          </LoaderItemContainer>
        </Cell>
      </TreeRowContainer>
    ) : null;
  }
}
