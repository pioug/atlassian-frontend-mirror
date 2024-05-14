/** @jsx jsx */
import { ReactElement, SyntheticEvent, useState } from 'react';

import { jsx } from '@emotion/react';

import { Box, xcss, Text } from '@atlaskit/primitives';
import noop from '@atlaskit/ds-lib/noop';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import Warning from '@atlaskit/icon/glyph/warning';
import { RadioGroup } from '@atlaskit/radio';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import Flag, { FlagGroup } from '../src';
import { AppearanceArray, AppearanceTypes } from '../src/types';

type Appearances<Keys extends AppearanceTypes> = {
  [K in Keys]: { description?: string; title: string; actions?: any[] };
};

const infoWrapperStyles = xcss({
  width: 'size.300',
  height: 'size.300',
});

const appearances: Appearances<AppearanceTypes> = {
  normal: {
    description: 'We cannot log in at the moment, please try again soon.',
    title: 'Welcome to the jungle',
  },
  error: {
    description: 'You need to take action, something has gone terribly wrong!',
    title: 'We are having issues',
  },
  info: {
    title: 'Connecting...',
  },
  success: {
    title: 'Connected',
  },
  warning: {
    title: 'Trying again...',
    actions: [{ content: 'Good luck!', onClick: noop }],
  },
};

const appearanceTypes = AppearanceArray;

const appearanceOptions = appearanceTypes.map((appearance) => {
  return {
    label: appearance,
    name: appearance,
    value: appearance,
  };
});

const iconMap = (key: string) => {
  const icons: { [key: string]: ReactElement } = {
    normal: <Tick label="Success" primaryColor={token('color.icon.success')} />,
    info: (
      <Box xcss={infoWrapperStyles}>
        <Spinner size="small" appearance="invert" />
      </Box>
    ),
    success: (
      <Tick
        label="Success"
        secondaryColor={token('color.background.success.bold')}
      />
    ),
    warning: (
      <Warning
        label="Warning"
        secondaryColor={token('color.background.warning.bold')}
      />
    ),
    error: (
      <Error
        label="Error"
        secondaryColor={token('color.background.danger.bold')}
      />
    ),
  };

  return key ? icons[key] : icons;
};

const getIcon = (key: string) => {
  return iconMap(key) as ReactElement;
};

const ConnectionDemo = () => {
  const [appearance, setAppearance] = useState<AppearanceTypes>(
    appearanceTypes[0],
  );

  return (
    <Box>
      <FlagGroup>
        <Flag
          appearance={appearance}
          icon={getIcon(appearance)}
          title={appearances[appearance].title}
          description={appearances[appearance].description}
          actions={appearances[appearance].actions}
          id="fake-flag"
        />
      </FlagGroup>
      <Text as="p">
        This story shows the transition between various flag appearances.
      </Text>
      <RadioGroup
        options={appearanceOptions}
        onChange={(e: SyntheticEvent<HTMLInputElement>) => {
          setAppearance(e.currentTarget.value as AppearanceTypes);
        }}
        defaultValue={appearanceTypes[0]}
      />
    </Box>
  );
};

export default ConnectionDemo;
