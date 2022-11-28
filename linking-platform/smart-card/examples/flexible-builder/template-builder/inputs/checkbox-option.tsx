import React, { useCallback } from 'react';
import { CheckboxField } from '@atlaskit/form';
import { Checkbox } from '@atlaskit/checkbox';
import { ChangeParams, handleOnChange } from '../../utils';

type Props<T extends object> = {
  defaultValue?: boolean;
  label?: string;
  name: string;
  onChange: (template: T) => void;
  propName: keyof T;
  template: T;
};
const CheckboxOption = <T extends object>({
  defaultValue = false,
  label,
  name,
  onChange,
  propName,
  template,
}: Props<T>) => {
  const handleOnCheckboxChange = useCallback(
    <T extends object>(...params: ChangeParams<T>) =>
      (e: React.SyntheticEvent<HTMLInputElement>) => {
        handleOnChange(...params, e.currentTarget.checked);
      },
    [],
  );

  return (
    <CheckboxField name={name}>
      {({ fieldProps }) => (
        <Checkbox
          {...fieldProps}
          isChecked={!!template[propName]}
          label={label}
          onChange={handleOnCheckboxChange(
            onChange,
            template,
            propName,
            defaultValue,
          )}
        />
      )}
    </CheckboxField>
  );
};
export default CheckboxOption;
