import React from 'react';
import { EnumField } from '@atlaskit/editor-common/extensions';
import CheckboxGroup from './CheckboxGroup';
import RadioGroup from './RadioGroup';
import Select from './Select';
import { OnBlur } from '../types';

export default function Enum({
  name,
  field,
  autoFocus,
  onBlur,
}: {
  name: string;
  field: EnumField;
  autoFocus: boolean;
  onBlur: OnBlur;
}) {
  switch (field.style) {
    case 'checkbox':
      return <CheckboxGroup name={name} field={field} onBlur={onBlur} />;

    case 'radio':
      return <RadioGroup name={name} field={field} onBlur={onBlur} />;

    case 'select':
      return (
        <Select
          name={name}
          field={field}
          onBlur={onBlur}
          placeholder={field.placeholder}
          autoFocus={autoFocus}
        />
      );
  }
}
