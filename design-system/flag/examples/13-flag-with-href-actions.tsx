import React, { ReactElement } from 'react';

import Stack from '@atlaskit/primitives/stack';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Warning from '@atlaskit/icon/glyph/warning';
import { G400, N0, N500, R300, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag, { AppearanceTypes } from '../src';

type FlagVariant = {
  appearance: AppearanceTypes;
  description: string;
  title: string;
  icon: ReactElement;
};

const FlagActions = [
  {
    content: 'with onClick',
    onClick: () => {
      console.log('flag action clicked');
    },
  },
  {
    content: 'with href',
    href: 'https://atlaskit.atlassian.com/',
    target: '_blank',
  },
];

const flagVariants: Array<FlagVariant> = [
  {
    appearance: 'error',
    description: 'You need to take action, something has gone terribly wrong!',
    title: 'error flag',
    icon: (
      <Error
        label="Error"
        secondaryColor={token('color.background.danger.bold', R300)}
      />
    ),
  },
  {
    appearance: 'info',
    description:
      "This alert needs your attention, but it's not super important.",
    title: 'info flag',
    icon: (
      <Info
        label="Info"
        secondaryColor={token('color.background.discovery.bold', N500)}
      />
    ),
  },
  {
    appearance: 'success',
    description: 'Nothing to worry about, everything is going great!',
    title: 'success flag',
    icon: (
      <Tick
        label="Success"
        secondaryColor={token('color.background.success.bold', G400)}
      />
    ),
  },
  {
    appearance: 'warning',
    description: 'Pay attention to me, things are not going according to plan.',
    title: 'warning flag',
    icon: (
      <Warning
        label="Warning"
        secondaryColor={token('color.background.warning.bold', Y300)}
      />
    ),
  },
  {
    appearance: 'normal',
    description: 'There is new update available',
    title: 'normal flag',
    icon: (
      <Tick
        label="Success"
        secondaryColor={token('elevation.surface.overlay', N0)}
      />
    ),
  },
];

export default () => (
  <Stack space="100">
    {flagVariants.map((flag: FlagVariant) => (
      <Flag
        appearance={flag.appearance}
        actions={FlagActions}
        description={flag.description}
        icon={flag.icon}
        id="1"
        key={flag.appearance}
        title={flag.title}
      />
    ))}
  </Stack>
);
