import React from 'react';
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
import { getSafeParentedName } from './utils';

function FieldComponent({
  field,
  parameters,
  parentName,
  extensionManifest,
  firstVisibleFieldName,
  onBlur,
}: {
  field: FieldDefinition;
  parameters: Parameters;
  parentName?: string;
  extensionManifest: ExtensionManifest;
  firstVisibleFieldName?: string;
  onBlur: OnBlur;
}) {
  const { name } = field;
  const autoFocus = name === firstVisibleFieldName;
  const defaultValue = parameters[name];
  const error = parameters.errors?.[name];
  const parentedName = getSafeParentedName(name, parentName);

  if (name in parameters && !isFieldset(field)) {
    field = { ...field, defaultValue };
  }

  switch (field.type) {
    case 'string':
      return (
        <String
          name={parentedName}
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
          placeholder={field.placeholder}
        />
      );

    case 'number':
      return (
        <Number
          name={parentedName}
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
          placeholder={field.placeholder}
        />
      );

    case 'boolean':
      return <Boolean name={parentedName} field={field} onBlur={onBlur} />;

    case 'date':
      return (
        <Date
          name={parentedName}
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
          placeholder={field.placeholder}
        />
      );

    case 'date-range':
      return (
        <DateRange
          name={parentedName}
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
        />
      );

    case 'enum':
      return (
        <Enum
          name={parentedName}
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
        />
      );
    case 'custom':
      return (
        <CustomSelect
          name={parentedName}
          field={field}
          extensionManifest={extensionManifest}
          placeholder={field.placeholder}
          autoFocus={autoFocus}
          onBlur={onBlur}
          parameters={parameters}
        />
      );

    case 'fieldset':
      return (
        <Fieldset
          name={parentedName}
          field={field}
          firstVisibleFieldName={firstVisibleFieldName}
          onFieldBlur={onBlur}
          extensionManifest={extensionManifest}
          parameters={defaultValue || {}}
          error={error}
        />
      );

    case 'user':
      return (
        <UserSelect
          name={parentedName}
          field={field}
          autoFocus={name === firstVisibleFieldName}
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
}: {
  fields: FieldDefinition[];
  parentName?: string;
  parameters?: Parameters;
  extensionManifest: ExtensionManifest;
  canRemoveFields?: boolean;
  onClickRemove?: (fieldName: string) => void;
  onFieldBlur: OnBlur;
  firstVisibleFieldName?: string;
}) {
  return (
    <>
      {fields.map((field: FieldDefinition) => {
        let fieldElement = (
          <FieldComponent
            field={field}
            parameters={parameters || {}}
            parentName={parentName}
            extensionManifest={extensionManifest}
            firstVisibleFieldName={firstVisibleFieldName}
            onBlur={onFieldBlur}
          />
        );

        // only to be supported by String fields at this time
        if ('isHidden' in field && field.isHidden) {
          fieldElement = <Hidden>{fieldElement}</Hidden>;
        }

        const { name } = field;
        return (
          <RemovableField
            key={name}
            name={name}
            canRemoveField={canRemoveFields && !field.isRequired}
            onClickRemove={onClickRemove}
          >
            {fieldElement}
          </RemovableField>
        );
      })}
    </>
  );
}
