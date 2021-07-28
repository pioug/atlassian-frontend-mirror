/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import Banner from '../src';

const Icon = <WarningIcon label="" secondaryColor="inherit" />;

const WarningBanner = ({ isOpen = true }: { isOpen: boolean }) => (
  <Banner icon={Icon} isOpen={isOpen} appearance="warning">
    This is a warning banner
  </Banner>
);

const buttonWrapperStyles = css({
  paddingBottom: 0,
  transition: 'padding 0.25s ease-in-out',
  willChange: 'padding',
});

const bottomPaddingStyles = css({
  paddingBottom: 8,
});

export default class ToggleBanner extends React.Component<
  {},
  { isOpen: boolean }
> {
  state = { isOpen: false };

  toggleBanner = () => this.setState((state) => ({ isOpen: !state.isOpen }));

  render() {
    const { isOpen } = this.state;

    return (
      <div>
        <div css={[buttonWrapperStyles, isOpen && bottomPaddingStyles]}>
          <Button appearance="primary" onClick={this.toggleBanner}>
            {isOpen ? 'Hide' : 'Show'} banner
          </Button>
        </div>
        <WarningBanner isOpen={isOpen} />
      </div>
    );
  }
}
