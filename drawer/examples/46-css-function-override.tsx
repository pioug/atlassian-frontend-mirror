/** @jsx jsx */

import { Component, SyntheticEvent } from 'react';
import { jsx } from '@emotion/core';
import { CSSObject } from '@emotion/core';
import Button from '@atlaskit/button';
import { N0, R400, Y400, G400, B400, P400, T400 } from '@atlaskit/theme/colors';
import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
}

const sidebarOverrideCssFn = (defaultStyles: CSSObject): CSSObject => ({
  color: N0,
  position: 'absolute',
  top: 24,
  left: 12,
});

const contentOverrideCssFn = (defaultStyles: CSSObject): CSSObject => ({
  ...defaultStyles,
  display: 'flex',
  marginTop: 0,
  flexDirection: 'column',
});

const sections = [
  [R400, 'Full'],
  [Y400, 'Layout'],
  [G400, 'Drawer'],
  [B400, 'Through'],
  [P400, 'CSS'],
  [T400, 'Override'],
];

export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: false,
  };

  openDrawer = () =>
    this.setState({
      isDrawerOpen: true,
    });

  onClose = (...args: [SyntheticEvent, any]) => {
    console.log('onClose', args);
    this.setState({
      isDrawerOpen: false,
    });
  };

  onCloseComplete = (...args: [HTMLElement]) =>
    console.log('onCloseComplete', args);

  render() {
    return (
      <div css={{ padding: '2rem' }}>
        <Drawer
          onClose={this.onClose}
          onCloseComplete={this.onCloseComplete}
          isOpen={this.state.isDrawerOpen}
          width="full"
          overrides={{
            Sidebar: {
              cssFn: sidebarOverrideCssFn,
            },
            Content: {
              cssFn: contentOverrideCssFn,
            },
          }}
        >
          {sections.map(([color, word], idx) => {
            return (
              <div
                css={{
                  flexDirection: 'column',
                  flex: 1,
                  backgroundColor: color,
                  textAlign: 'center',
                  color: N0,
                }}
              >
                <h1
                  css={{
                    maxWidth: '50%',
                    margin: '0 auto',
                    position: 'relative',
                    transform: 'translate(0, -50%)',
                    top: '50%',
                    color: N0,
                  }}
                >
                  {word}
                </h1>
              </div>
            );
          })}
        </Drawer>
        <Button id="open-drawer" type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}
