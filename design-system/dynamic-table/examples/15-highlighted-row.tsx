import React from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { AtlaskitThemeProvider } from '@atlaskit/theme/components';

import { DynamicTableStateless } from '../src';

import { head, rows } from './content/sample-data';

enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

interface State {
  highlightedRow: number;
  themeMode: ThemeMode;
}

const getOppositeTheme = (themeMode: ThemeMode) =>
  themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
const paddingStyle = { padding: '8px 0' };

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, State> {
  state = {
    highlightedRow: 3,
    themeMode: ThemeMode.LIGHT,
  };

  switchTheme = () => {
    const { themeMode } = this.state;
    this.setState({
      themeMode: getOppositeTheme(themeMode),
    });
  };

  setHighlightedRow = (rowNumber: number) =>
    this.setState({
      highlightedRow: rowNumber,
    });

  render() {
    return (
      <AtlaskitThemeProvider mode={this.state.themeMode}>
        <h4 style={paddingStyle}>
          Click on the buttons to highlight the corresponding row
        </h4>
        <ButtonGroup>
          {[0, 2, 5, 6, 8, 9].map((nos) => (
            <Button onClick={() => this.setHighlightedRow(nos)} key={nos}>
              {nos}
            </Button>
          ))}
        </ButtonGroup>
        <div style={paddingStyle}>
          <Button onClick={this.switchTheme}>
            Switch theme to {getOppositeTheme(this.state.themeMode)}
          </Button>
        </div>

        <DynamicTableStateless
          head={head}
          highlightedRowIndex={this.state.highlightedRow}
          rows={rows}
          rowsPerPage={40}
          page={1}
        />
      </AtlaskitThemeProvider>
    );
  }
}
