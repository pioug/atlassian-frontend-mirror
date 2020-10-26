import React, { Component, ComponentType } from 'react';
import { N400, N0, R300, B300 } from '@atlaskit/theme/colors';
import Button from '@atlaskit/button/standard-button';

import CheckboxIcon from '../glyph/checkbox';
import RadioIcon from '../glyph/radio';

type IconPair = [string, ComponentType<any>][];

const toggleableIcons: IconPair = [
  ['checkbox', CheckboxIcon],
  ['radio', RadioIcon],
];

const styles = {
  iconChecked: {
    color: N400,
    fill: N0,
  },
  iconUnchecked: {
    color: N400,
    fill: N400,
  },
  iconReverse: {
    color: R300,
    fill: B300,
  },
};

type State = {
  toggleColor: boolean;
  toggleFill: boolean;
  icons: IconPair;
};

export default class ToggleIcons extends Component<{}, State> {
  readonly state: State = {
    toggleColor: false,
    toggleFill: false,
    icons: toggleableIcons,
  };

  render() {
    const colorStyle = this.state.toggleColor
      ? styles.iconChecked
      : styles.iconUnchecked;
    const colorStyleReverse = this.state.toggleFill
      ? styles.iconReverse
      : styles.iconChecked;

    return (
      <div>
        <h6 style={{ padding: 0, margin: '10px 5px' }}>
          Click on these icons wrapped into a button to see them &#39;check&#39;
          and &#39;uncheck&#39; itselves
        </h6>

        <div style={colorStyle}>
          {this.state.icons.map(([id, Icon]) => (
            <Button
              onClick={() =>
                this.setState({ toggleColor: !this.state.toggleColor })
              }
              key={id}
            >
              <Icon
                key={id}
                label="Icon which checks and unchecks itself"
                secondaryColor="inherit"
              />
            </Button>
          ))}
        </div>
        <h6 style={{ padding: 0, margin: '10px 5px' }}>
          Click on these icons wrapped into a button to see them
          &#39;reverse&#39; itself while staying &#39;checked&#39;
        </h6>
        <div style={styles.iconReverse}>
          {this.state.icons.map(([id, Icon]) => (
            <Button
              onClick={() =>
                this.setState({ toggleFill: !this.state.toggleFill })
              }
              key={id}
            >
              <Icon
                key={id}
                label="Icon which checks and unchecks itself"
                primaryColor={
                  this.state.toggleFill
                    ? colorStyleReverse.fill
                    : colorStyleReverse.color
                }
              />
            </Button>
          ))}
        </div>
      </div>
    );
  }
}
