import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import {
  AtlaskitThemeProvider,
  elevation as AkElevations,
  themed,
} from '../src';
import { Elevation } from '../src/types';

const elevations = { ...AkElevations };

// the below adaptation may be written statically like ${akElevationMixins.e100}
const Box = styled.div<{ elevation: Elevation }>`
  ${({ elevation }) => elevations[elevation]}
  background-color: ${() => themed({ light: 'white', dark: '#283447' })};
  border-radius: 3px;
  margin-bottom: 2em;
  min-width: 240px;
  padding: 16px 24px;
  text-align: center;
`;

const Wrapper = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

interface Props {}
type State = { themeMode: 'light' | 'dark' };

export default class extends React.Component<Props, State> {
  state: State = { themeMode: 'light' };

  switchTheme = () => {
    const { themeMode } = this.state;
    this.setState({
      themeMode: themeMode === 'light' ? 'dark' : 'light',
    });
  };

  render() {
    const { themeMode } = this.state;

    return (
      <AtlaskitThemeProvider mode={themeMode}>
        <Wrapper>
          <Box elevation="e100">Cards on a board (e100)</Box>
          <Box elevation="e200">Inline dialogs (e200)</Box>
          <Box elevation="e300">Modals (e300)</Box>
          <Box elevation="e400">Panels (e400)</Box>
          <Box elevation="e500">Flag messages (e500)</Box>
        </Wrapper>

        <div style={{ padding: 8, textAlign: 'center' }}>
          <Button appearance="primary" onClick={this.switchTheme}>
            Switch theme ({themeMode})
          </Button>
        </div>
      </AtlaskitThemeProvider>
    );
  }
}
