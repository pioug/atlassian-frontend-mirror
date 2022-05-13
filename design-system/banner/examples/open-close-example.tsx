/** @jsx jsx */
import React, { Fragment } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import Banner from '../src';

const Icon = <WarningIcon label="" secondaryColor="inherit" />;

const WarningBanner = ({ isOpen = true }: { isOpen: boolean }) => (
  <Banner icon={Icon} isOpen={isOpen} appearance="warning">
    This is a warning banner
  </Banner>
);

export default class ToggleBanner extends React.Component<
  {},
  { isOpen: boolean }
> {
  state = { isOpen: false };

  toggleBanner = () => this.setState((state) => ({ isOpen: !state.isOpen }));

  render() {
    const { isOpen } = this.state;

    return (
      <Fragment>
        <Button appearance="primary" onClick={this.toggleBanner}>
          {isOpen ? 'Hide' : 'Show'} banner
        </Button>
        <WarningBanner isOpen={isOpen} />
      </Fragment>
    );
  }
}
