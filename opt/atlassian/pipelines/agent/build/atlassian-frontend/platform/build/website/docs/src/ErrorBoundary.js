/* eslint-disable react/prop-types */
import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  componentDidCatch(error, info) {
    const { onError } = this.props;
    this.setState({ hasError: true });
    if (onError) {
      onError(error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return <h4>Something went wrong loading this example.</h4>;
    }
    return this.props.children;
  }
}
