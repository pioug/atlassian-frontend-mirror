import React, { Component, ReactElement, ReactNode } from 'react';
import Button from '@atlaskit/button';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Warning from '@atlaskit/icon/glyph/warning';
import { colors } from '@atlaskit/theme';
import Flag, { FlagGroup } from '../src';

type State = {
  flags: Array<flagData>;
};

type flagData = {
  created: number;
  description: string;
  icon: ReactNode;
  id: number;
  key: number;
  title: string;
  testId: string;
};

const getRandomIcon = () => {
  const icons = iconMap() as { [key: string]: object };
  const iconArray = Object.keys(icons).map(i => icons[i]);
  return iconArray[Math.floor(Math.random() * iconArray.length)];
};

const iconMap = (key?: string, color?: string) => {
  const icons: { [key: string]: ReactElement } = {
    info: <Info label="Info icon" primaryColor={color || colors.P300} />,
    success: <Tick label="Success icon" primaryColor={color || colors.G300} />,
    warning: (
      <Warning label="Warning icon" primaryColor={color || colors.Y300} />
    ),
    error: <Error label="Error icon" primaryColor={color || colors.R300} />,
  };

  return key ? icons[key] : icons;
};

const getFlagData = (index: number, timeOffset: number = 0): flagData => {
  return {
    created: Date.now() - timeOffset * 1000,
    description: 'I am a flag',
    icon: getRandomIcon(),
    id: index,
    key: index,
    title: `${index + 1}: Whoa a new flag!`,
    testId: `MyFlagTestId--${index + 1}`,
  };
};

export default class FlagGroupExample extends Component<void, State> {
  state = { flags: [] };

  flagCount = 0;

  addFlag = () => {
    const flags = this.state.flags.slice() as flagData[];
    flags.unshift(getFlagData(this.flagCount++));
    this.setState({ flags });
  };

  dismissFlag = () => {
    this.setState(state => ({ flags: state.flags.slice(1) }));
    this.flagCount--;
  };

  render() {
    const actions = [
      {
        content: 'Nice one!',
        onClick: () => alert('Flag has been clicked!'),
        testId: 'MyFlagAction',
      },
      { content: 'Not right now thanks', onClick: this.dismissFlag },
    ];

    return (
      <div>
        <FlagGroup onDismissed={this.dismissFlag}>
          {this.state.flags.map(flag => (
            <Flag actions={actions} {...flag} />
          ))}
        </FlagGroup>
        <Button onClick={this.addFlag} testId="AddFlag">
          Add Flag
        </Button>
      </div>
    );
  }
}
