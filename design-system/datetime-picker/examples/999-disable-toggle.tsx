import React, { useCallback, useState } from 'react';

import { DatePicker } from '@atlaskit/datetime-picker';
import { Label } from '@atlaskit/field-base';
import Toggle from '@atlaskit/toggle';

export default () => {
  const [isDisabled, setIsDisabled] = useState(true);

  const toggleDisabled = useCallback(() => {
    setIsDisabled((currentState) => !currentState);
  }, [setIsDisabled]);

  return (
    <div>
      <Label label="DatePicker isDisabled" htmlFor="toggle" />
      <Toggle id="toggle" isChecked={isDisabled} onChange={toggleDisabled} />
      <Label label="Disabled inputs" />
      <DatePicker testId="datePicker" isDisabled={isDisabled} />
    </div>
  );
};
