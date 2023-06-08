import React, { ReactElement } from 'react';
import Stack from '@atlaskit/primitives/stack';
import noop from '@atlaskit/ds-lib/noop';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Warning from '@atlaskit/icon/glyph/warning';
import { G300, G400, N500, R300, Y300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Flag from '../src';
import { AppearanceTypes } from '../src/types';

const actions = [
  { content: 'Understood', onClick: noop },
  { content: 'No Way!', onClick: noop },
];
const appearances: { [key: string]: { description: string; title: string } } = {
  normal: {
    description:
      'We got fun and games. We got everything you want honey, we know the names.',
    title: 'Welcome to the jungle',
  },
  error: {
    description: 'You need to take action, something has gone terribly wrong!',
    title: 'Uh oh!',
  },
  info: {
    description:
      "This alert needs your attention, but it's not super important.",
    title: 'Hey, did you know...',
  },
  success: {
    description: 'Nothing to worry about, everything is going great!',
    title: 'Good news, everyone',
  },
  warning: {
    description: 'Pay attention to me, things are not going according to plan.',
    title: 'Heads up!',
  },
};

const iconMap = (key: string) => {
  const icons: { [key: string]: ReactElement } = {
    normal: (
      <Tick
        label="Normal success"
        primaryColor={token('color.icon.success', G300)}
      />
    ),
    info: (
      <Info
        label="Info"
        secondaryColor={token('color.background.neutral.bold', N500)}
      />
    ),
    success: (
      <Tick
        label="Success"
        secondaryColor={token('color.background.success.bold', G400)}
      />
    ),
    warning: (
      <Warning
        label="Warning"
        secondaryColor={token('color.background.warning.bold', Y300)}
      />
    ),
    error: (
      <Error
        label="Error"
        secondaryColor={token('color.background.danger.bold', R300)}
      />
    ),
  };

  return key ? icons[key] : icons;
};

const getIcon = (key: string) => {
  return iconMap(key) as ReactElement;
};

export default () => (
  <Stack space="space.100">
    {Object.keys(appearances).map((type, idx) => (
      <Flag
        actions={actions}
        appearance={type as AppearanceTypes}
        description={appearances[type].description}
        icon={getIcon(type)}
        id={type}
        key={type}
        title={appearances[type].title}
        testId={`flag-${type}`}
      />
    ))}
  </Stack>
);
