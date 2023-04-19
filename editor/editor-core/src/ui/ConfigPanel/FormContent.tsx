import React from 'react';

import {
  FieldDefinition,
  isFieldset,
  TabGroupField,
  TabField,
} from '@atlaskit/editor-common/extensions';
import ColorPicker from './Fields/ColorPicker';
import Boolean from './Fields/Boolean';
import CustomSelect from './Fields/CustomSelect';
import Date from './Fields/Date';
import DateRange from './Fields/DateRange';
import Enum from './Fields/Enum';
import Fieldset from './Fields/Fieldset';
import Number from './Fields/Number';
import String from './Fields/String';
import UnhandledType from './Fields/UnhandledType';
import UserSelect from './Fields/UserSelect';
import Expand from './Fields/Expand';
import TabGroup from './Fields/TabGroup';

import RemovableField from './NestedForms/RemovableField';
import { FieldComponentProps, FormContentProps } from './types';
import { getSafeParentedName } from './utils';
import { FormErrorBoundary } from './FormErrorBoundary';

export function FieldComponent({
  field,
  parameters,
  parentName,
  extensionManifest,
  firstVisibleFieldName,
  onFieldChange,
  featureFlags,
}: FieldComponentProps) {
  const { name, type } = field;
  const autoFocus = name === firstVisibleFieldName;
  const defaultValue = parameters[name];
  const error = parameters.errors?.[name];
  const parentedName = getSafeParentedName(name, parentName);
  const fieldDefaultValue =
    field.type === 'enum' ? field.defaultValue : undefined;
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
          onFieldChange={onFieldChange}
          placeholder={field.placeholder}
        />
      );

    case 'number':
      return (
        <Number
          name={parentedName}
          field={field}
          autoFocus={autoFocus}
          onFieldChange={onFieldChange}
          placeholder={field.placeholder}
        />
      );

    case 'boolean':
      return (
        <Boolean
          name={parentedName}
          field={field}
          onFieldChange={onFieldChange}
        />
      );

    case 'color':
      return (
        <ColorPicker
          name={parentedName}
          field={field}
          onFieldChange={onFieldChange}
          featureFlags={featureFlags}
        />
      );

    case 'date':
      return (
        <Date
          name={parentedName}
          field={field}
          autoFocus={autoFocus}
          onFieldChange={onFieldChange}
          placeholder={field.placeholder}
        />
      );

    case 'date-range':
      return (
        <DateRange
          name={parentedName}
          field={field}
          autoFocus={autoFocus}
          onFieldChange={onFieldChange}
        />
      );

    case 'enum':
      return (
        <Enum
          name={parentedName}
          field={field}
          autoFocus={autoFocus}
          onFieldChange={onFieldChange}
          fieldDefaultValue={fieldDefaultValue}
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
          onFieldChange={onFieldChange}
          parameters={parameters}
        />
      );

    case 'fieldset':
      return (
        <Fieldset
          name={parentedName}
          field={field}
          firstVisibleFieldName={firstVisibleFieldName}
          onFieldChange={onFieldChange}
          extensionManifest={extensionManifest}
          parameters={defaultValue || {}}
          error={error}
          formComponent={FormContent}
        />
      );

    case 'user':
      return (
        <UserSelect
          name={parentedName}
          field={field}
          autoFocus={name === firstVisibleFieldName}
          extensionManifest={extensionManifest}
          onFieldChange={onFieldChange}
        />
      );

    case 'expand': {
      // if expand is under a tab with hasGroupedValues=true
      const resolvedParentName =
        [parentName, field.hasGroupedValues ? field.name : undefined]
          .filter((val) => !!val)
          .join('.') || undefined;
      const resolvedParameters = !field.hasGroupedValues
        ? parameters
        : parameters[field.name] || {};

      return (
        <Expand field={field} isExpanded={field.isExpanded}>
          <FormContent
            parentName={resolvedParentName}
            fields={field.fields}
            parameters={resolvedParameters}
            onFieldChange={onFieldChange}
            extensionManifest={extensionManifest}
            featureFlags={featureFlags}
          />
        </Expand>
      );
    }

    case 'tab-group': {
      const tabGroupField = field as TabGroupField;
      const tabGroupParams = tabGroupField.hasGroupedValues
        ? parameters[tabGroupField.name] || {}
        : parameters;

      const renderPanel = (tabField: TabField) => {
        const parentName =
          [
            tabGroupField.hasGroupedValues ? tabGroupField.name : undefined,
            tabField.hasGroupedValues ? tabField.name : undefined,
          ]
            .filter((val) => !!val)
            .join('.') || undefined;
        const tabParameters = tabField.hasGroupedValues
          ? tabGroupParams[tabField.name] || {}
          : tabGroupParams;

        return (
          <FormContent
            parentName={parentName}
            fields={tabField.fields}
            parameters={tabParameters}
            onFieldChange={onFieldChange}
            extensionManifest={extensionManifest}
            featureFlags={featureFlags}
          />
        );
      };

      return <TabGroup field={tabGroupField} renderPanel={renderPanel} />;
    }
    default:
      return (
        <UnhandledType
          field={field}
          errorMessage={`Field "${name}" of type "${type}" not supported`}
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
  onFieldChange,
  firstVisibleFieldName,
  contextIdentifierProvider,
  featureFlags,
}: FormContentProps) {
  return (
    <FormErrorBoundary
      contextIdentifierProvider={contextIdentifierProvider}
      extensionKey={extensionManifest.key}
      fields={fields}
    >
      {fields.map((field: FieldDefinition) => {
        let fieldElement = (
          <FieldComponent
            field={field}
            parameters={parameters || {}}
            parentName={parentName}
            extensionManifest={extensionManifest}
            firstVisibleFieldName={firstVisibleFieldName}
            onFieldChange={onFieldChange}
            featureFlags={featureFlags}
          />
        );

        // only to be supported by String fields at this time
        if ('isHidden' in field && field.isHidden) {
          fieldElement = <Hidden>{fieldElement}</Hidden>;
        }

        const { name, type } = field;
        return (
          <RemovableField
            key={name}
            name={name}
            canRemoveField={canRemoveFields && !field.isRequired}
            onClickRemove={onClickRemove}
            className={`field-wrapper-${type}`}
          >
            {fieldElement}
          </RemovableField>
        );
      })}
    </FormErrorBoundary>
  );
}
