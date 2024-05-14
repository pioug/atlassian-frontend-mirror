import React, { useCallback, useState } from 'react';

import EditIcon from '@atlaskit/icon/glyph/edit';
import { Inline, Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

import { IconButton } from '../../../../src/new';

const IconButtonLoadingExample = () => {
  const [isLoading, setIsLoading] = useState(true);

  const toggleLoading = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(event.currentTarget.checked);
    },
    [],
  );

  return (
    <Stack space="space.200" alignInline="start">
      <Inline alignBlock="center">
        <Toggle
          isChecked={isLoading}
          id="enable-loading"
          onChange={toggleLoading}
        />
        <label htmlFor="show-overlay">Enable loading state</label>
      </Inline>
      <IconButton isLoading={isLoading} icon={EditIcon} label="Edit" />
    </Stack>
  );
};

export default IconButtonLoadingExample;
