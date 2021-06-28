import React from 'react';

import Button from '@atlaskit/button/standard-button';
import { gridSize } from '@atlaskit/theme/constants';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G400 } from '@atlaskit/theme/colors';
import { AutoDismissFlag, FlagGroup } from '../../src';

const AutoDismissFlagSuccessExample = () => {
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
        {flags.map((flagId) => {
          return (
            <AutoDismissFlag
              appearance="success"
              id={flagId}
              icon={<SuccessIcon label="Success" secondaryColor={G400} />}
              key={flagId}
              title={`#${flagId} Welcome to the room`}
              description="I will auto dismiss after 8 seconds."
            />
          );
        })}
      </FlagGroup>
    </div>
  );
};

export default AutoDismissFlagSuccessExample;
