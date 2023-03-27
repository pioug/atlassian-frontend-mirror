import React from 'react';

import Button from '@atlaskit/button/standard-button';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

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
      <p style={{ padding: token('space.200', '16px') }}>
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
              icon={
                <SuccessIcon
                  label="Success"
                  secondaryColor={token('color.background.success.bold', G400)}
                />
              }
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
