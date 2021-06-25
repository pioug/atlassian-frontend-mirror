import React, { ReactElement, ReactNode, useState, useCallback } from 'react';

import Button from '@atlaskit/button/standard-button';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Warning from '@atlaskit/icon/glyph/warning';
import { G300, P300, R300, Y300 } from '@atlaskit/theme/colors';

import Flag, { FlagGroup } from '../../src';

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
    info: <Info label="Info" primaryColor={color || P300} />,
    success: <Tick label="Success" primaryColor={color || G300} />,
    warning: <Warning label="Warning" primaryColor={color || Y300} />,
    error: <Error label="Error" primaryColor={color || R300} />,
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
    <div>
      <Button appearance="primary" onClick={addFlag}>
        Add Flag
      </Button>
      <FlagGroup onDismissed={dismissFlag}>
        {flags.map((flag) => (
          <Flag
            actions={[
              {
                content: 'Nice one!',
                onClick: () => {},
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
    </div>
  );
};

export default FlagGroupExample;
