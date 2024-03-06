/**  @jsx jsx */

import { useCallback, useState } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import Flag, { FlagGroup, FlagProps } from '@atlaskit/flag';
import { Box, xcss } from '@atlaskit/primitives';

import { GiveKudosLauncher } from '../src';

const buttonWrapperStyles = xcss({
  margin: 'space.200',
});

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const [flags, setFlags] = useState<Array<FlagProps>>([]);

  const addFlag = (flag: FlagProps) => {
    setFlags(current => [flag, ...current]);
  };

  const dismissFlag = useCallback(
    (id: string | number) => {
      setFlags(current => current.filter(flag => flag.id !== id));
    },
    [setFlags],
  );

  const openGiveKudos = () => {
    setIsOpen(true);
  };

  const kudosClosed = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Box xcss={buttonWrapperStyles}>
        <Button onClick={openGiveKudos}>Give Kudos</Button>
      </Box>
      <GiveKudosLauncher
        testId={'giveKudosLauncher'}
        isOpen={isOpen}
        onClose={kudosClosed}
        analyticsSource={'test'}
        teamCentralBaseUrl={'http://localhost:3000'}
        cloudId={'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5'}
        addFlag={addFlag}
      />
      <FlagGroup onDismissed={dismissFlag}>
        {flags.map(flag => (
          <Flag {...flag} />
        ))}
      </FlagGroup>
    </div>
  );
}
