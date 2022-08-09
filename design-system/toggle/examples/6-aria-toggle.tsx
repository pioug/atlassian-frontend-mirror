import React, { useState } from 'react';

import Tooltip from '@atlaskit/tooltip';

import Toggle from '../src';

export default () => {
  const [isChecked, handleOnchange] = useState(false);
  const checkedText = 'Allow pull requests';
  const uncheckedText = 'Disable pull requests';
  const getContent = () => (isChecked ? uncheckedText : checkedText);
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="Some_ID">Allow pull requests</label>
      <Tooltip content={getContent()} position="right">
        <Toggle
          size="large"
          onChange={() => handleOnchange(!isChecked)}
          id="Some_ID"
        />
      </Tooltip>
    </div>
  );
};
