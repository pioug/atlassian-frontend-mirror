import React, { ComponentType, useState } from 'react';
import { N400, N0, R300, B300 } from '@atlaskit/theme/colors';
import Button from '@atlaskit/button/new';

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

const ToggleIcons = () => {
  const [isColorToggled, setIsColorToggled] = useState(false);
  const [isFillToggled, setIsFillToggled] = useState(false);

  const colorStyle = isColorToggled ? styles.iconChecked : styles.iconUnchecked;
  const colorStyleReverse = isFillToggled
    ? styles.iconReverse
    : styles.iconChecked;

  return (
    <div>
      <h2 id="toggle-label">Toggle icons</h2>
      <p id="selected-heading">
        Activate these icons wrapped by a button to toggle between their
        selected and unselected states
      </p>
      <div
        role="group"
        aria-labelledby="toggle-label"
        aria-describedby="selected-heading"
      >
        <div style={colorStyle}>
          {toggleableIcons.map(([id, Icon]) => (
            <Button onClick={() => setIsColorToggled((old) => !old)} key={id}>
              <Icon
                key={id}
                label="Icon which toggles between their selected and unselected states"
                secondaryColor="inherit"
              />
            </Button>
          ))}
        </div>
      </div>
      <p id="checked-heading">
        Activate these icons wrapped by a button to see them reverse themselves
        while staying checked
      </p>
      <div
        role="group"
        aria-labelledby="toggle-label"
        aria-describedby="checked-heading"
      >
        <div style={styles.iconReverse}>
          {toggleableIcons.map(([id, Icon]) => (
            <Button onClick={() => setIsFillToggled((old) => !old)} key={id}>
              <Icon
                key={id}
                label="Icon which toggles between their checked and unchecked states"
                primaryColor={
                  isFillToggled
                    ? colorStyleReverse.fill
                    : colorStyleReverse.color
                }
              />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToggleIcons;
