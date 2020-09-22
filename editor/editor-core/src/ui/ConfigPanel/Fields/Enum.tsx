import React from 'react';
import { EnumField } from '@atlaskit/editor-common/extensions';
import CheckboxGroup from './CheckboxGroup';
import RadioGroup from './RadioGroup';
import Select from './Select';
import { OnBlur } from '../types';

export default function Enum({
  field,
  autoFocus,
  onBlur,
}: {
  field: EnumField;
  autoFocus: boolean;
  onBlur: OnBlur;
}) {
  const { name } = field;
  switch (field.style) {
    case 'checkbox':
      return <CheckboxGroup key={name} field={field} onBlur={onBlur} />;

    case 'radio':
      return <RadioGroup key={name} field={field} onBlur={onBlur} />;

    case 'select':
      return (
        <Select
          key={name}
          field={field}
          onBlur={onBlur}
          placeholder={field.placeholder}
          autoFocus={autoFocus}
        />
      );
  }
}
