/** @jsx jsx */

import { Component, SyntheticEvent } from 'react';

import { css, CSSObject, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { B400, G400, N0, P400, R400, T400, Y400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';

interface State {
  isDrawerOpen: boolean;
}

const sidebarOverrideCssFn = (defaultStyles: CSSObject): CSSObject => ({
  color: N0,
  position: 'absolute',
  top: token('space.300', '24px'),
  left: token('space.150', '12px'),
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

const sectionStyles = css({
  flex: 1,
  flexDirection: 'column',
  color: N0,
  textAlign: 'center',
});

const sectionHeaderStyles = css({
  maxWidth: '50%',
  margin: '0 auto',
  position: 'relative',
  color: N0,
  insetBlockStart: '50%',
  transform: 'translate(0, -50%)',
});
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

  onCloseComplete = (args: any) => console.log('onCloseComplete', args);

  render() {
    return (
      <div style={{ padding: token('space.400', '2rem') }}>
        <Drawer
          onClose={this.onClose}
          onCloseComplete={this.onCloseComplete}
          isOpen={this.state.isDrawerOpen}
          width="full"
          label="Drawer with css custom overrides"
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
          overrides={{
            Sidebar: {
              cssFn: sidebarOverrideCssFn,
            },
            Content: {
              cssFn: contentOverrideCssFn,
            },
          }}
        >
          {sections.map(([backgroundColor, word]) => {
            return (
              <div key={word} style={{ backgroundColor }} css={sectionStyles}>
                <h1 css={sectionHeaderStyles}>{word}</h1>
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
