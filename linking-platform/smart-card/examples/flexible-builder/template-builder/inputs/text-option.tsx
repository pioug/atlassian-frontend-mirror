import React, { useCallback } from 'react';
import { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import { type ChangeParams, handleOnChange } from '../../utils';

type Props<T extends object> = {
  defaultValue?: string;
  label?: string;
  name: string;
  onChange: (template: T) => void;
  propName: keyof T;
  template: T;
};

const TextOption = <T extends object>({
  defaultValue = '',
  label,
  name,
  onChange,
  propName,
  template,
}: Props<T>) => {
  const handleOnTextChange = useCallback(
    <T extends object>(...params: ChangeParams<T>) =>
      (e: React.SyntheticEvent<HTMLInputElement>) => {
        handleOnChange(...params, e.currentTarget.value);
      },
    [],
  );

  return (
    <Field label={label} name={name} defaultValue={defaultValue}>
      {({ fieldProps }) => (
        <Textfield
          {...fieldProps}
          onChange={handleOnTextChange(
            onChange,
            template,
            propName,
            defaultValue,
          )}
        />
      )}
    </Field>
  );
};

export default TextOption;
