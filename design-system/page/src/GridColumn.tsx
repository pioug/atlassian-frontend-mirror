import React, { Component } from 'react';

import { ThemeProvider, withTheme } from 'styled-components';

import GridColumn from './internal/GridColumnElement';
import { defaultGridColumns } from './internal/vars';
import { GridColumnProps } from './types';

const defaultSpacing = 'cosy';

export default withTheme(
  class AkGridColumn extends Component<GridColumnProps> {
    static defaultProps = {
      medium: 0,
    };

    getTheme = (props: GridColumnProps) => ({
      columns:
        props.theme && props.theme.columns
          ? props.theme.columns
          : defaultGridColumns,
      spacing:
        props.theme && props.theme.spacing
          ? props.theme.spacing
          : defaultSpacing,
      isNestedGrid: false,
    });

    getNestedTheme = (props: GridColumnProps) => ({
      columns: props.medium,
      spacing:
        props.theme && props.theme.spacing
          ? props.theme.spacing
          : defaultSpacing,
      isNestedGrid: true,
    });

    render() {
      return (
        <ThemeProvider theme={this.getTheme(this.props)}>
          <GridColumn medium={this.props.medium}>
            <ThemeProvider theme={this.getNestedTheme(this.props)}>
              <div>{this.props.children}</div>
            </ThemeProvider>
          </GridColumn>
        </ThemeProvider>
      );
    }
  },
);
