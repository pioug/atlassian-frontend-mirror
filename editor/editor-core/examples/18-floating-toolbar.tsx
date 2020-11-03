/* eslint-disable no-console */

import React from 'react';
import { Component } from 'react';
import styled from 'styled-components';

import { R500, Y500, G500 } from '@atlaskit/theme/colors';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { Skeleton } from '@atlaskit/icon';

import Toolbar from '../src/plugins/floating-toolbar/ui/Toolbar';
import { FloatingToolbarItem } from '../src/plugins/floating-toolbar/types';
import ColorPalette from '../src/ui/ColorPalette';
import { Content } from '../example-helpers/styles';
import cellBackgroundColorPalette from '../src/ui/ColorPalette/Palettes/cellBackgroundColorPalette';

const SAVE_ACTION = () => console.log('Save');
// const analyticsHandler = (actionName, props) => console.log(actionName, props);

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 96px);
`;

const RedIcon = () => <Skeleton weight="strong" color={R500} />;
const YellowIcon = () => <Skeleton weight="strong" color={Y500} />;
const GreenIcon = () => <Skeleton weight="strong" color={G500} />;

const BUTTONS: Array<FloatingToolbarItem<Function>> = [
  {
    type: 'button',
    icon: RedIcon,
    onClick: () => {},
    title: 'Red button',
    hidden: true,
  },
  {
    type: 'button',
    icon: YellowIcon,
    onClick: () => {},
    title: 'Yellow button',
  },
  {
    type: 'button',
    icon: GreenIcon,
    onClick: () => {},
    title: 'Green button',
  },
];

const BUTTONS_WITH_SEPARATORS: Array<FloatingToolbarItem<Function>> = [
  {
    type: 'button',
    icon: RedIcon,
    onClick: () => {},
    title: 'Red button',
    hidden: true,
  },
  {
    type: 'separator',
    hidden: true,
  },
  {
    type: 'button',
    icon: YellowIcon,
    onClick: () => {},
    title: 'Yellow button',
  },
  {
    type: 'separator',
  },
  {
    type: 'button',
    icon: GreenIcon,
    onClick: () => {},
    title: 'Green button',
  },
];

const DROPDOWNS: Array<FloatingToolbarItem<Function>> = [
  {
    type: 'dropdown',
    title: 'Yellow dropdown',
    icon: YellowIcon,
    options: [
      {
        title: 'Header row',
        selected: false,
        onClick: () => {},
      },
      {
        title: 'Header column',
        selected: true,
        onClick: () => {},
      },
      {
        title: 'Number column',
        selected: false,
        onClick: () => {},
      },
    ],
  },
  {
    type: 'dropdown',
    title: 'Green dropdown',
    icon: GreenIcon,
    options: {
      render: ({ hide }) => (
        <ColorPalette
          palette={cellBackgroundColorPalette}
          selectedColor={null}
          onClick={() => {
            SAVE_ACTION();
            hide();
          }}
        />
      ),
      width: 146,
      height: 72,
    },
  },
];

export default class Example extends Component {
  state = {
    active: 'buttons',
  };

  render() {
    return (
      <Content>
        <Container>
          <Toolbar
            items={this.getActiveItems()}
            // these examples aren't prosemirror specific
            node={undefined as any}
            dispatchCommand={() => SAVE_ACTION}
          />
        </Container>
        <div className="toolsDrawer">
          <div>
            <ButtonGroup>
              {this.renderButton('buttons', 'Buttons')}
              {this.renderButton(
                'buttons-with-separators',
                'Buttons with separator',
              )}
              {this.renderButton('dropdowns', 'Dropdowns')}
            </ButtonGroup>
          </div>
        </div>
      </Content>
    );
  }

  renderButton = (name: string, label: string) => (
    <Button
      spacing="compact"
      aria-label={name}
      appearance={this.state.active === name ? 'primary' : 'default'}
      onClick={() => this.setState({ active: name })}
    >
      {label}
    </Button>
  );

  getActiveItems = () => {
    switch (this.state.active) {
      case 'buttons-with-separators':
        return BUTTONS_WITH_SEPARATORS;
      case 'dropdowns':
        return DROPDOWNS;
      default:
        return BUTTONS;
    }
  };
}
