import React, { Component, Fragment, SyntheticEvent } from 'react';
import Pagination from '../src';

const Pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type StateType = {
  onChangeEvent: any;
};

export default class extends Component<{}, StateType> {
  state = {
    onChangeEvent: 1,
  };

  handleChange = (event: SyntheticEvent, newPage: any) =>
    this.setState({ onChangeEvent: newPage });

  render() {
    return (
      <Fragment>
        <Pagination pages={Pages} onChange={this.handleChange} />
        <p>selected page from onChange hook: {this.state.onChangeEvent}</p>
      </Fragment>
    );
  }
}
