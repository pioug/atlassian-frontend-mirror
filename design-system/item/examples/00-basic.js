/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { darken, mix } from 'polished';

import Avatar from '@atlaskit/avatar';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors, gridSize } from '@atlaskit/theme';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';

import Item, { ItemGroup, itemThemeNamespace } from '../src';

const generateTheme = (
  padding,
  baseBgColor,
  textColor,
  secondaryTextColor,
  focusColor,
) => ({
  afterItemSpacing: {
    compact: 0,
    default: 0,
  },
  beforeItemSpacing: {
    compact: 0,
    default: 0,
  },
  borderRadius: 0,
  focus: {
    outline: focusColor || '',
  },
  padding: {
    default: {
      bottom: padding,
      left: padding,
      right: padding,
      top: padding,
    },
    compact: {
      bottom: padding * 0.5,
      left: padding * 0.5,
      right: padding * 0.5,
      top: padding * 0.5,
    },
  },
  default: {
    background: baseBgColor,
    text: textColor,
    secondaryText: secondaryTextColor,
  },
  hover: {
    background: darken(0.05, baseBgColor),
    text: textColor,
    secondaryText: secondaryTextColor,
  },
  selected: {
    background: darken(0.05, baseBgColor),
    text: textColor,
    secondaryText: secondaryTextColor,
  },
  active: {
    background: darken(0.1, baseBgColor),
    text: textColor,
    secondaryText: secondaryTextColor,
  },
  disabled: {
    background: baseBgColor,
    text: mix(0.5, baseBgColor, textColor),
    secondaryText: mix(0.5, baseBgColor, secondaryTextColor),
  },
});

export default class ItemThemeDemo extends Component {
  static defaultProps = {
    backgroundColor: colors.N30,
    padding: gridSize(),
    secondaryTextColor: colors.N80,
    textColor: colors.N900,
  };

  render() {
    const myTheme = generateTheme(
      this.props.padding,
      this.props.backgroundColor,
      this.props.textColor,
      this.props.secondaryTextColor,
      this.props.focusColor,
    );

    return (
      <Root background={myTheme.default.background}>
        <ThemeProvider theme={{ [itemThemeNamespace]: myTheme }}>
          <ItemGroup title={this.props.title}>
            <Item description="Some description text">First item</Item>
            <Item elemBefore={<Avatar size="xsmall" />}>
              Item two with just avatar and main text
            </Item>
            <Item
              description="I should not be clickable or focusable and should have disabled cursor"
              isDisabled
            >
              Disabled item
            </Item>
            <Item elemBefore={<Avatar size="small" />}>
              Item with lots and lots and lots and lots and lots and lots and
              lots and lots and lots and lots and lots and lots and lots and
              lots and lots and lots of text and lots and lots and lots and lots
              and lots and lots and lots and lots and lots and lots !
            </Item>
            <Item elemAfter={<CheckCircleIcon size="medium" label="" />}>
              Notice how the icon colour changes based on theme, item with lots
              and lots and lots and lots and lots and lots and lots and lots and
              lots and lots of text and lots and lots and lots and lots and lots
              and lots and lots and lots and lots and lots !
            </Item>
            <ItemGroup isCompact title="Compact and selected">
              <Item isCompact>I am a compact item</Item>
              <Item isCompact isSelected>
                I am compact and selected
              </Item>
            </ItemGroup>
          </ItemGroup>
        </ThemeProvider>
      </Root>
    );
  }
}

const Root = styled.div`
  background-color: ${(props) => props.background};
  margin: ${gridSize() * 3}px 0;
`;
