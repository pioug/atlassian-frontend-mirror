import React, { useState } from 'react';
import { exampleOptions } from '../example-helpers';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import { OnChange, Value } from '../src/types';

type ExampleProps = {};
type ExampleInternalProps = {
  onChange: OnChange;
  value: Value;
};

const ExampleInternal = (props: ExampleInternalProps) => {
  let { onChange, value } = props;
  return (
    <ExampleWrapper>
      {({ options, onInputChange }) => (
        <UserPicker
          fieldId="example"
          options={options}
          onChange={onChange}
          onInputChange={onInputChange}
          isMulti
          value={value}
          defaultValue={[exampleOptions[0], exampleOptions[1]]}
        />
      )}
    </ExampleWrapper>
  );
};

const Example = (props: ExampleProps) => {
  const [selectedEntities, setSelectedEntities] = useState<Value>([] as Value);

  const handleSelectEntities = (selectedEntities: Value) => {
    setSelectedEntities(selectedEntities);
  };
  return (
    <ExampleInternal onChange={handleSelectEntities} value={selectedEntities} />
  );
};
export default Example;
