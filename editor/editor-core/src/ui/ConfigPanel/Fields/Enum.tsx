import React from 'react';
import { EnumField } from '@atlaskit/editor-common/extensions';
import CheckboxGroup from './CheckboxGroup';
import RadioGroup from './RadioGroup';
import Select from './Select';
import { OnFieldChange } from '../types';

export default function Enum({
  name,
  field,
  autoFocus,
  onFieldChange,
  fieldDefaultValue,
}: {
  name: string;
  field: EnumField;
  autoFocus: boolean;
  onFieldChange: OnFieldChange;
  fieldDefaultValue?: string | string[];
}) {
  switch (field.style) {
    case 'checkbox':
      return (
        <CheckboxGroup
          name={name}
          field={field}
          onFieldChange={onFieldChange}
        />
      );

    case 'radio':
      return (
        <RadioGroup name={name} field={field} onFieldChange={onFieldChange} />
      );

    case 'select':
      return (
        <Select
          name={name}
          field={field}
          onFieldChange={onFieldChange}
          placeholder={field.placeholder}
          autoFocus={autoFocus}
          fieldDefaultValue={fieldDefaultValue}
        />
      );
  }
}
