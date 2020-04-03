import React, { Component, Fragment, SyntheticEvent } from 'react';
import Pagination from '../src';

const PAGES = [...Array(10)].map((_, i) => ({
  label: i + 1,
  href: `page-${i + 1}`,
}));

type StateType = {
  onChangeEvent: {
    label: number;
    href: string;
  };
};

export default class extends Component<{}, StateType> {
  state = {
    onChangeEvent: {
      label: 1,
      href: 'page-1',
    },
  };

  handleChange = (event: SyntheticEvent, newPage: any) =>
    this.setState({ onChangeEvent: newPage });

  getLabel = ({ label }: any) => label;

  render() {
    return (
      <Fragment>
        <Pagination
          pages={PAGES}
          onChange={this.handleChange}
          getPageLabel={this.getLabel}
        />
        <p>Received onChange event:</p>
        <pre>
          label: {this.state.onChangeEvent.label}
          <br />
          href: {this.state.onChangeEvent.href}
        </pre>
      </Fragment>
    );
  }
}
