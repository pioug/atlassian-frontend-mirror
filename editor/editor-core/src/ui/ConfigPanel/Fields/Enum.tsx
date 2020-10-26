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
  parentName,
}: {
  field: EnumField;
  autoFocus: boolean;
  onBlur: OnBlur;
  parentName?: string;
}) {
  const { name } = field;
  switch (field.style) {
    case 'checkbox':
      return (
        <CheckboxGroup
          key={name}
          parentName={parentName}
          field={field}
          onBlur={onBlur}
        />
      );

    case 'radio':
      return (
        <RadioGroup
          key={name}
          parentName={parentName}
          field={field}
          onBlur={onBlur}
        />
      );

    case 'select':
      return (
        <Select
          key={name}
          parentName={parentName}
          field={field}
          onBlur={onBlur}
          placeholder={field.placeholder}
          autoFocus={autoFocus}
        />
      );
  }
}
