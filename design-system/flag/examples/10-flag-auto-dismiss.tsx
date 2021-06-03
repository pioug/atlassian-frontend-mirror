import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { G400, N0, N500, R400, Y200 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { AutoDismissFlag, FlagGroup } from '../src';
import { AppearanceTypes } from '../src/types';

const appearances: AppearanceTypes[] = [
  'error',
  'info',
  'normal',
  'success',
  'warning',
];
const color = {
  error: R400,
  info: N500,
  normal: N0,
  success: G400,
  warning: Y200,
};

const AutoDismissExample = () => {
  const [flags, setFlags] = useState<Array<number>>([]);

  const addFlag = () => {
    const newFlagId = flags.length + 1;
    const newFlags = flags.slice();
    newFlags.splice(0, 0, newFlagId);

    setFlags(newFlags);
  };

  const handleDismiss = () => {
    setFlags(flags.slice(1));
  };

  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addFlag, []);

  return (
    <div>
      <p style={{ padding: `${gridSize() * 2}px` }}>
        <Button appearance="primary" onClick={addFlag}>
          Add another Flag
        </Button>
      </p>
      <FlagGroup onDismissed={handleDismiss}>
        {flags.map((flagId) => {
          const appearance = appearances[flagId % appearances.length];
          return (
            <AutoDismissFlag
              appearance={appearance}
              id={flagId}
              icon={
                <SuccessIcon
                  label="Success"
                  size="medium"
                  secondaryColor={color[appearance]}
                />
              }
              key={flagId}
              title={`Flag #${flagId}`}
              description="I will auto dismiss after 8 seconds"
            />
          );
        })}
      </FlagGroup>
    </div>
  );
};

export default AutoDismissExample;
