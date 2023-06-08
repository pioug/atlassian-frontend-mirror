import React, { ReactElement, ReactNode, useState, useCallback } from 'react';

import Button from '@atlaskit/button/standard-button';
import Box from '@atlaskit/primitives/box';
import noop from '@atlaskit/ds-lib/noop';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Warning from '@atlaskit/icon/glyph/warning';
import { G300, P300, R300, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag, { FlagGroup } from '../src';

type flagData = {
  created: number;
  description: string;
  icon: ReactNode;
  id: number;
  key: number;
  title: string;
};

const getRandomIcon = () => {
  const icons = iconMap() as { [key: string]: object };
  const iconArray = Object.keys(icons).map((i) => icons[i]);
  return iconArray[Math.floor(Math.random() * iconArray.length)];
};

const iconMap = (key?: string, color?: string) => {
  const icons: { [key: string]: ReactElement } = {
    info: (
      <Info
        label="Info"
        primaryColor={color || token('color.icon.information', P300)}
      />
    ),
    success: (
      <Tick
        label="Success"
        primaryColor={color || token('color.icon.success', G300)}
      />
    ),
    warning: (
      <Warning
        label="Warning"
        primaryColor={color || token('color.icon.warning', Y300)}
      />
    ),
    error: (
      <Error
        label="Error"
        primaryColor={color || token('color.icon.danger', R300)}
      />
    ),
  };

  return key ? icons[key] : icons;
};

const getRandomDescription = () => {
  const descriptions = [
    'Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.',
    'Fruitcake topping wafer pie candy dragée sesame snaps cake. Cake cake cheesecake. Pie tiramisu carrot cake tart tart dessert cookie. Lemon drops cookie tootsie roll marzipan liquorice cotton candy brownie halvah.',
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const getFlagData = (index: number): flagData => {
  return {
    created: Date.now(),
    description: getRandomDescription(),
    icon: getRandomIcon(),
    id: index,
    key: index,
    title: `${index + 1}: Whoa a new flag!`,
  };
};

const FlagGroupExample = () => {
  const [flags, setFlags] = useState<Array<flagData>>([]);

  const addFlag = () => {
    setFlags((current) => [getFlagData(flags.length), ...current]);
  };

  const dismissFlag = useCallback(
    (id: string | number) => {
      setFlags((current) => current.filter((flag) => flag.id !== id));
    },
    [setFlags],
  );

  return (
    <Box>
      <FlagGroup onDismissed={dismissFlag}>
        {flags.map((flag) => (
          <Flag
            actions={[
              {
                content: 'Nice one!',
                onClick: noop,
              },
              {
                content: 'Not right now thanks',
                onClick: () => dismissFlag(flag.id),
              },
            ]}
            {...flag}
          />
        ))}
      </FlagGroup>
      <Button onClick={addFlag}>Add Flag</Button>
    </Box>
  );
};

export default FlagGroupExample;
