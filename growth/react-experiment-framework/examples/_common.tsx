/* eslint-disable react/prop-types,react/no-multi-comp */

import React, { Component } from 'react';

export class Control extends Component<{ title: string }> {
  render() {
    const { title = '' } = this.props;
    const text = `Control ${title}`;
    return <div>{text}</div>;
  }
}

export class VariantA extends Component<{ title: string }> {
  render() {
    const { title = '' } = this.props;
    const text = `Variant A ${title}`;
    return <div>{text}</div>;
  }
}

export class VariantB extends Component<{ title: string }> {
  render() {
    const { title = '' } = this.props;
    const text = `Variant B ${title}`;
    return <div>{text}</div>;
  }
}

export class Broken extends Component<{ title: string }> {
  renderError() {
    throw new Error('Threw on render');
  }

  render() {
    this.renderError();
    return null;
  }
}

export class Loader extends Component<{}> {
  render() {
    return <div>Loading ...</div>;
  }
}
