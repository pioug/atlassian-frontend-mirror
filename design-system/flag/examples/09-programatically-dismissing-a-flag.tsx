import React, { ReactElement, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import InfoIcon from '@atlaskit/icon/glyph/info';
import { gridSize } from '@atlaskit/theme/constants';

import Flag, { FlagGroup } from '../src';

const ProgrammaticFlagDismissExample = () => {
  const [flags, setFlags] = useState<Array<ReactElement>>([
    <Flag
      id="flag1"
      key="flag1"
      title="Can I leave yet?"
      description="Dismiss me by clicking the button on the page"
      icon={<InfoIcon label="Info" />}
    />,
  ]);

  const dismissFlag = () => {
    setFlags([]);
  };

  return (
    <div>
      <p style={{ padding: `${gridSize() * 2}px` }}>
        <Button appearance="primary" onClick={dismissFlag}>
          Dismiss the Flag
        </Button>
      </p>
      <FlagGroup>{flags}</FlagGroup>
    </div>
  );
};

export default ProgrammaticFlagDismissExample;
