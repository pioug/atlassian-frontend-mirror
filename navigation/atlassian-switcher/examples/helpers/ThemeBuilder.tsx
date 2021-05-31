import React from 'react';
import TextField from '@atlaskit/textfield';
import { Field } from '@atlaskit/form';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { ThemingPublicApi } from '../../src/ui/theme/types';
import ColorScheme from './ColorScheme';
import styled from 'styled-components';

const FieldWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: calc(100% - 40px);
`;

const Color = styled.div<{ color: string }>`
  display: inline-block;
  vertical-align: middle;
  width: 24px;
  height: 24px;
  margin-left: 8px;
  background-color: ${({ color }) => color};
`;

const PresetList = styled.ul`
  padding: 0;
  list-style: none;
`;

const PresetItem = styled.li`
  cursor: pointer;
  display: flex;
`;

type Props = {
  children: (theme: ThemingPublicApi) => React.ReactNode;
};

// colors picked from trello's website. Alpha channel was removed to avoid overlays
const trello = {
  primaryTextColor: '#172b4d',
  secondaryTextColor: '#5e6c84',
  primaryHoverBackgroundColor: '#E0E2E5',
  secondaryHoverBackgroundColor: '#F5F6F7',
};

const greenishColorScheme = {
  primaryTextColor: '#006400',
  secondaryTextColor: '#4ca64c',
  primaryHoverBackgroundColor: '#cce5cc',
  secondaryHoverBackgroundColor: '#e5f2e5',
};

const redishColorScheme = {
  primaryTextColor: '#8B0000',
  secondaryTextColor: '#ff4c4c',
  primaryHoverBackgroundColor: '#ffcccc',
  secondaryHoverBackgroundColor: '#ffe5e5',
};

const blueishColorScheme = {
  primaryTextColor: '#000080',
  secondaryTextColor: '#03396c',
  primaryHoverBackgroundColor: '#ccffff',
  secondaryHoverBackgroundColor: '#e5ffff',
};

const colorSchemes = [
  { name: 'green', colorScheme: greenishColorScheme },
  { name: 'red', colorScheme: redishColorScheme },
  { name: 'blue', colorScheme: blueishColorScheme },
  { name: 'trello', colorScheme: trello },
];

type State = ThemingPublicApi;
export default class ThemeBuilder extends React.Component<Props, State> {
  state = {
    ...greenishColorScheme,
  };
  selectPreset = (preset: ThemingPublicApi) => {
    this.setState(preset);
  };
  createUpdateColorFn = (colorName: keyof ThemingPublicApi) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.persist();
    this.setState((state) => ({
      ...state,
      [colorName]: `${e.target.value}`,
    }));
  };
  render() {
    return (
      <Page>
        <Grid layout="fixed">
          <GridColumn medium={6}>{this.props.children(this.state)}</GridColumn>
          <GridColumn medium={6}>
            <h6>Examples:</h6>
            <PresetList>
              {colorSchemes.map((preset) => {
                return (
                  <PresetItem
                    onClick={() => this.selectPreset(preset.colorScheme)}
                  >
                    <ColorScheme colorScheme={preset.colorScheme} />
                    {preset.name}
                  </PresetItem>
                );
              })}
            </PresetList>
            <h6>Customize your own:</h6>
            {Object.keys(this.state).map((fieldName) => (
              <Field name={fieldName} label={fieldName}>
                {({ fieldProps }: any) => {
                  const currentColor = this.state[
                    fieldName as keyof ThemingPublicApi
                  ];
                  return (
                    <>
                      <FieldWrapper>
                        <TextField
                          {...fieldProps}
                          defaultValue={currentColor}
                          onChange={this.createUpdateColorFn(
                            fieldName as keyof ThemingPublicApi,
                          )}
                        />
                      </FieldWrapper>
                      <Color color={currentColor} />
                    </>
                  );
                }}
              </Field>
            ))}

            <h6>Copy your theme:</h6>
            <pre>{JSON.stringify(this.state, null, 3)}</pre>
          </GridColumn>
        </Grid>
      </Page>
    );
  }
}
