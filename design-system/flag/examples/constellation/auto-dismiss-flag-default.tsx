import React from 'react';

import Button from '@atlaskit/button/standard-button';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { AutoDismissFlag, FlagGroup } from '../../src';

const AutoDismissFlagDefaultExample = () => {
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
              id={flagId}
              icon={
                <SuccessIcon
                  primaryColor={G300}
                  label="Success"
                  size="medium"
                />
              }
              key={flagId}
              title={`#${flagId} Your changes were saved`}
              description="I will auto dismiss after 8 seconds."
            />
          );
        })}
      </FlagGroup>
    </div>
  );
};

export default AutoDismissFlagDefaultExample;
