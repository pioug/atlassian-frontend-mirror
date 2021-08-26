/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { ComponentType, useState } from 'react';
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

const ToggleIcons: React.FC = () => {
  const [isColorToggled, setIsColorToggled] = useState(false);
  const [isFillToggled, setIsFillToggled] = useState(false);

  const colorStyle = isColorToggled ? styles.iconChecked : styles.iconUnchecked;
  const colorStyleReverse = isFillToggled
    ? styles.iconReverse
    : styles.iconChecked;

  return (
    <div>
      <h6 style={{ padding: 0, margin: '10px 5px' }}>
        Click on these icons wrapped by a button to see them &#39;check&#39; and
        &#39;uncheck&#39; itselves
      </h6>

      <div style={colorStyle}>
        {toggleableIcons.map(([id, Icon]) => (
          <Button onClick={() => setIsColorToggled((old) => !old)} key={id}>
            <Icon
              key={id}
              label="Icon which checks and unchecks itself"
              secondaryColor="inherit"
            />
          </Button>
        ))}
      </div>
      <h6 style={{ padding: 0, margin: '10px 5px' }}>
        Click on these icons wrapped by a button to see them &#39;reverse&#39;
        itself while staying &#39;checked&#39;
      </h6>
      <div style={styles.iconReverse}>
        {toggleableIcons.map(([id, Icon]) => (
          <Button onClick={() => setIsFillToggled((old) => !old)} key={id}>
            <Icon
              key={id}
              label="Icon which checks and unchecks itself"
              primaryColor={
                isFillToggled ? colorStyleReverse.fill : colorStyleReverse.color
              }
            />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ToggleIcons;
