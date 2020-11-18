import React from 'react';

import AKForm, { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';

import Tabs from '../src';

const tabs = [
  {
    label: 'Tab 1',
    content: (
      <Field id="field1" name="field1" defaultValue="" label="Field 1">
        {({ fieldProps }) => <Textfield {...fieldProps} />}
      </Field>
    ),
  },
  {
    label: 'Tab 2',
    content: (
      <Field id="field2" name="field2" defaultValue="" label="Field 2">
        {({ fieldProps }) => <Textfield {...fieldProps} />}
      </Field>
    ),
  },
];

export default () => (
  <div className="App">
    <AKForm
      onSubmit={(value: any) => console.log('submitted value is ', value)}
    >
      {({ formProps }) => (
        <form {...formProps}>
          <Tabs tabs={tabs} isContentPersisted={true} />
          <button type="submit">submit</button>
        </form>
      )}
    </AKForm>
  </div>
);
