import React, { useCallback, useMemo } from 'react';
import Select from '@atlaskit/select/Select';
import { Field } from '@atlaskit/form';
import { ValueType as Value } from '@atlaskit/select';
import { ChangeParams, handleOnChange } from '../../utils';

type Props<T> = {
  defaultValue: T[keyof T];
  label?: string;
  name: string;
  onChange: (template: T) => void;
  propName: keyof T;
  options: { label: string; value: T[keyof T] }[];
  template: T;
  value?: T[keyof T];
};
const SelectOption = <T extends object>({
  defaultValue,
  label,
  name,
  onChange,
  propName,
  options,
  template,
}: Props<T>) => {
  const handleOnSelectChange = useCallback(
    <T extends object>(...params: ChangeParams<T>) =>
      (option: { label: string; value: T[keyof T] } | null) => {
        handleOnChange(...params, option?.value);
      },
    [],
  );

  const value = useMemo(() => {
    const selectedValue = template[propName];
    const selectedOrDefault = selectedValue || defaultValue;
    return options.find((option) => option.value === selectedOrDefault);
  }, [defaultValue, options, propName, template]);

  return (
    <Field<Value<{ label: string; value: string }>> name={name} label={label}>
      {({ fieldProps: { id, ...rest } }) => (
        <Select
          {...rest}
          onChange={handleOnSelectChange(
            onChange,
            template,
            propName,
            defaultValue,
          )}
          options={options}
          value={value}
        />
      )}
    </Field>
  );
};

export default SelectOption;
