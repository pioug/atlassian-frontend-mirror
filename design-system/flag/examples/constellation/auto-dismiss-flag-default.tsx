import React from 'react';

import Button from '@atlaskit/button';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { gridSize } from '@atlaskit/theme/constants';

import { AutoDismissFlag, FlagGroup } from '../../src';

const AutoDismissFlagDefault = () => {
  const [flags, setFlags] = React.useState<Array<number>>([]);

  const addFlag = () => {
    const newFlagId = flags.length + 1;
    const newFlags = flags.slice();
    newFlags.splice(0, 0, newFlagId);

    setFlags(newFlags);
  };

  const handleDismiss = () => {
    setFlags(flags.slice(1));
  };

  return (
    <div>
      <p style={{ padding: `${gridSize() * 2}px` }}>
        <Button appearance="primary" onClick={addFlag}>
          Add flag
        </Button>
      </p>
      <FlagGroup onDismissed={handleDismiss}>
        {flags.map(flagId => {
          return (
            <AutoDismissFlag
              id={flagId}
              icon={<SuccessIcon label="Success" size="medium" />}
              key={flagId}
              title={`#${flagId} Delete the Newtown repository`}
              description="I will auto dismiss after 8 seconds."
            />
          );
        })}
      </FlagGroup>
    </div>
  );
};

export default AutoDismissFlagDefault;
