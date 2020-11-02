import React, { Fragment } from 'react';
import { ExtensionManifest } from '@atlaskit/editor-common';

import {
  FieldDefinition,
  isFieldset,
  Parameters,
} from '@atlaskit/editor-common/extensions';

import Boolean from './Fields/Boolean';
import CustomSelect from './Fields/CustomSelect';
import Date from './Fields/Date';
import DateRange from './Fields/DateRange';
import Enum from './Fields/Enum';
// eslint-disable-next-line import/no-cycle
import Fieldset from './Fields/Fieldset';
import Number from './Fields/Number';
import String from './Fields/String';
import UnhandledType from './Fields/UnhandledType';
import UserSelect from './Fields/UserSelect';

import RemovableField from './NestedForms/RemovableField';
import { OnBlur } from './types';

type FormProps = {
  fields: FieldDefinition[];
  parentName?: string;
  parameters?: Parameters;
  extensionManifest: ExtensionManifest;
  canRemoveFields?: boolean;
  onClickRemove?: (fieldName: string) => void;
  onFieldBlur: OnBlur;
  firstVisibleFieldName?: string;
};

type FieldProps = {
  field: FieldDefinition;
  parentName?: string;
  parameters?: Parameters;
  extensionManifest: ExtensionManifest;
  firstVisibleFieldName?: string;
  onBlur: OnBlur;
};

function FieldComponent({
  field,
  parentName,
  parameters,
  extensionManifest,
  firstVisibleFieldName,
  onBlur,
}: FieldProps) {
  const { name } = field;
  const autoFocus = name === firstVisibleFieldName;

  if (!isFieldset(field)) {
    field.defaultValue = (parameters && parameters[name]) || field.defaultValue;
  }

  switch (field.type) {
    case 'string':
      return (
        <String
          parentName={parentName}
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
          placeholder={field.placeholder}
        />
      );

    case 'number':
      return (
        <Number
          parentName={parentName}
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
          placeholder={field.placeholder}
        />
      );

    case 'boolean':
      return <Boolean parentName={parentName} field={field} onBlur={onBlur} />;

    case 'date':
      return (
        <Date
          parentName={parentName}
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
          placeholder={field.placeholder}
        />
      );

    case 'date-range':
      return (
        <DateRange
          parentName={parentName}
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
        />
      );

    case 'enum':
      return (
        <Enum
          parentName={parentName}
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
        />
      );

    case 'custom':
      return (
        <CustomSelect
          parentName={parentName}
          field={field}
          extensionManifest={extensionManifest}
          placeholder={field.placeholder}
          autoFocus={autoFocus}
          onBlur={onBlur}
        />
      );

    case 'fieldset':
      return (
        <Fieldset
          field={field}
          firstVisibleFieldName={firstVisibleFieldName}
          onFieldBlur={onBlur}
          extensionManifest={extensionManifest}
          parameters={(parameters && parameters[field.name]) || {}}
          error={parameters?.errors?.[field.name]}
        />
      );

    case 'user':
      return (
        <UserSelect
          field={field}
          autoFocus={field.name === firstVisibleFieldName}
          extensionManifest={extensionManifest}
          onBlur={onBlur}
        />
      );

    default:
      return (
        <UnhandledType
          field={field}
          // @ts-ignore, not possible, but maybe Typescript is wrong
          errorMessage={`Field "${name}" of type "${field.type}" not supported`}
        />
      );
  }
}

function Hidden({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'none' }}>{children}</div>;
}

export default function FormContent({
  fields,
  parentName,
  parameters,
  extensionManifest,
  canRemoveFields,
  onClickRemove,
  onFieldBlur,
  firstVisibleFieldName,
}: FormProps) {
  return (
    <Fragment>
      {fields.map((field: FieldDefinition) => {
        const { name } = field;

        let fieldElement = (
          <FieldComponent
            field={field}
            parentName={parentName}
            parameters={parameters}
            extensionManifest={extensionManifest}
            firstVisibleFieldName={firstVisibleFieldName}
            onBlur={onFieldBlur}
          />
        );

        // only to be supported by String fields at this time
        if ('isHidden' in field && field.isHidden) {
          fieldElement = <Hidden>{fieldElement}</Hidden>;
        }

        return (
          <RemovableField
            key={name}
            name={name}
            canRemoveField={canRemoveFields}
            onClickRemove={onClickRemove}
          >
            {fieldElement}
          </RemovableField>
        );
      })}
    </Fragment>
  );
}
