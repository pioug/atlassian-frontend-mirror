import React from 'react';

import Button from '@atlaskit/button/standard-button';
import { gridSize } from '@atlaskit/theme/constants';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { Y200 } from '@atlaskit/theme/colors';
import { AutoDismissFlag, FlagGroup } from '../../src';

const AutoDismissFlagWarningExample = () => {
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
              appearance="warning"
              id={flagId}
              icon={<WarningIcon label="Warning" secondaryColor={Y200} />}
              key={flagId}
              title={`#${flagId} I'm a warning`}
              description="I will auto dismiss after 8 seconds."
            />
          );
        })}
      </FlagGroup>
    </div>
  );
};

export default AutoDismissFlagWarningExample;
