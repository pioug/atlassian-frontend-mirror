/* eslint-disable import/no-extraneous-dependencies */
import React, { Component, ComponentType } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import RadioGroup from '@atlaskit/field-radio-group';
import { colors } from '@atlaskit/theme';
import styled from 'styled-components';
import * as logos from '../src';
import { Props as ConstantProps } from '../src/constants';

const Centered = styled.div`
  display: flex;
  > * {
    margin: 8px 0;
  }
`;
const InlineFlex = styled.div`
  display: inline-flex;
`;

const sizePresets: ConstantProps['size'][] = [
  'xsmall',
  'small',
  'medium',
  'large',
  'xlarge',
];

const sizeRange = (
  Logo: ComponentType<ConstantProps>,
  colorPresetProps: ConstantProps,
  size: ConstantProps['size'],
  useProps: boolean,
) => {
  const props = useProps ? colorPresetProps : { label: '' };
  return (
    <Centered>
      <Logo size={size} {...props} />
    </Centered>
  );
};

const colorPresets = [
  {
    textColor: colors.N700,
    iconColor: colors.B200,
    iconGradientStart: colors.B400,
    iconGradientStop: colors.B200,
  },
  {
    textColor: 'currentColor',
    iconColor: 'currentColor',
    iconGradientStart: 'rgba(0, 0, 0, 0.4)',
    iconGradientStop: 'currentColor',
  },
  {
    textColor: colors.B400,
    iconColor: colors.B200,
    iconGradientStart: colors.B400,
    iconGradientStop: colors.B200,
  },
  {
    textColor: 'orange',
    iconColor: 'royalblue',
  },
  {
    textColor: 'rgb(60, 160, 180)',
    iconColor: 'rgb(100, 190, 60)',
    iconGradientStart: 'rgb(50, 100, 50)',
    iconGradientStop: 'rgb(100, 190, 60)',
  },
];

type Props = {};

type State = {
  colorIndex: number;
  sizeIndex: number;
  useProps: boolean;
};

export default class InteractiveLogo extends Component<Props, State> {
  state: State = {
    colorIndex: 0,
    sizeIndex: 1,
    useProps: true,
  };

  onRadioChange = () => {
    this.setState({
      useProps: !this.state.useProps,
    });
  };

  toggleColor = () => {
    this.setState({
      colorIndex: (this.state.colorIndex + 1) % colorPresets.length,
    });
  };

  toggleSize = () => {
    this.setState({
      sizeIndex: (this.state.sizeIndex + 1) % sizePresets.length,
    });
  };

  render() {
    const colorPreset = colorPresets[this.state.colorIndex];
    const sizePreset = sizePresets[this.state.sizeIndex];
    const radioItems = [
      {
        name: 'color',
        value: 'props',
        label: 'Set colour via component props',
        defaultSelected: true,
      },
      { name: 'color', value: 'inherit', label: 'Inherit colour from parent' },
    ];

    const { useProps } = this.state;

    return (
      <div
        style={{
          color: this.state.useProps ? colors.N300 : colorPreset.iconColor,
        }}
      >
        <ButtonGroup>
          <Button onClick={this.toggleSize}>Change size</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button onClick={this.toggleColor}>Change colour</Button>
        </ButtonGroup>
        <InlineFlex>
          <RadioGroup items={radioItems} onRadioChange={this.onRadioChange} />
        </InlineFlex>
        {sizeRange(logos.AtlassianLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.BitbucketLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.ConfluenceLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.HipchatLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.JiraLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.JiraCoreLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(
          logos.JiraServiceDeskLogo,
          colorPreset,
          sizePreset,
          useProps,
        )}
        {sizeRange(logos.JiraSoftwareLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.OpsGenieLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.StatuspageLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.StrideLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.TrelloLogo, colorPreset, sizePreset, useProps)}
      </div>
    );
  }
}
