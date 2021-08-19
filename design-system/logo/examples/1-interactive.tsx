/** @jsx jsx */
import { Component, ComponentType } from 'react';

import { css, jsx } from '@emotion/core';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import RadioGroup from '@atlaskit/field-radio-group';
import * as colors from '@atlaskit/theme/colors';

import * as logos from '../src';
import type { Props as ConstantProps } from '../src/constants';

const centeredStyles = css({
  display: 'flex',
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '> *': {
    margin: '8px 0',
  },
});

const Centered = ({ ...rest }) => <div css={centeredStyles} {...rest} />;

const inlineFlexStyles = css({
  display: 'inline-flex',
});

const InlineFlex = ({ ...rest }) => <div css={inlineFlexStyles} {...rest} />;

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
        {sizeRange(logos.AtlassianStartLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.BitbucketLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.CompassLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.ConfluenceLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.HalpLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.JiraLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(
          logos.JiraServiceManagementLogo,
          colorPreset,
          sizePreset,
          useProps,
        )}
        {sizeRange(logos.JiraSoftwareLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(
          logos.JiraWorkManagementLogo,
          colorPreset,
          sizePreset,
          useProps,
        )}
        {sizeRange(logos.OpsgenieLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.StatuspageLogo, colorPreset, sizePreset, useProps)}
        {sizeRange(logos.TrelloLogo, colorPreset, sizePreset, useProps)}
      </div>
    );
  }
}
