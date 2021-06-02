import React, { FormEvent, MouseEvent, useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import TextField from '@atlaskit/textfield';

import { AnalyticsListener, UIAnalyticsEvent } from '../src';

const Form = () => {
  const [value, setValue] = useState('Joe Bloggs');

  const handleInputChange = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value);
    },
    [setValue],
  );

  const handleSubmitButtonClick = useCallback(
    (e: MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
      analyticsEvent
        .update((payload) => ({
          ...payload,
          value,
        }))
        .fire();
    },
    [value],
  );

  return (
    <div>
      <TextField
        label="Name"
        width="small"
        onChange={handleInputChange}
        value={value}
      />
      <p>
        <Button appearance="primary" onClick={handleSubmitButtonClick}>
          Submit
        </Button>
      </p>
    </div>
  );
};

const App = () => {
  const onEvent = ({ payload }: UIAnalyticsEvent) =>
    console.log('Event payload:', payload);

  return (
    <AnalyticsListener onEvent={onEvent}>
      <Form />
    </AnalyticsListener>
  );
};

export default App;
