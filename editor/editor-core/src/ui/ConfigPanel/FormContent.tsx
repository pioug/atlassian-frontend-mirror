import React, { Fragment } from 'react';
import styled from 'styled-components';

import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';
import { ExtensionManifest } from '@atlaskit/editor-common';

import {
  FieldDefinition,
  isFieldset,
  Parameters,
} from '@atlaskit/editor-common/extensions';

import Boolean from './Fields/Boolean';
import CustomSelect from './Fields/CustomSelect';
import Date from './Fields/Date';
import Enum from './Fields/Enum';
// eslint-disable-next-line import/no-cycle
import Fieldset from './Fields/Fieldset';
import Number from './Fields/Number';
import String from './Fields/String';
import UnhandledType from './Fields/UnhandledType';

import RemovableField from './NestedForms/RemovableField';
import { OnBlur } from './types';

const FieldWrapper = styled.div`
  margin-bottom: ${multiply(gridSize, 3)}px;
`;

const pickUsedParameters = (
  parameters: Parameters = {},
  fields: FieldDefinition[],
) => {
  return fields.reduce<Parameters>((curr, next) => {
    if (typeof parameters[next.name] !== 'undefined') {
      curr[next.name] = parameters[next.name];
    }

    return curr;
  }, {});
};

type FormProps = {
  fields: FieldDefinition[];
  parameters?: Parameters;
  extensionManifest: ExtensionManifest;
  canRemoveFields?: boolean;
  onClickRemove?: (fieldName: string) => void;
  onFieldBlur: OnBlur;
  firstVisibleFieldName?: string;
};

type FieldProps = {
  field: FieldDefinition;
  parameters?: Parameters;
  extensionManifest: ExtensionManifest;
  firstVisibleFieldName?: string;
  onBlur: OnBlur;
};

function FieldComponent({
  field,
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
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
          placeholder={field.placeholder}
        />
      );

    case 'number':
      return (
        <Number
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
          placeholder={field.placeholder}
        />
      );

    case 'boolean':
      return <Boolean field={field} onBlur={onBlur} />;

    case 'date':
      return (
        <Date
          field={field}
          autoFocus={autoFocus}
          onBlur={onBlur}
          placeholder={field.placeholder}
        />
      );

    case 'enum':
      return <Enum field={field} autoFocus={autoFocus} onBlur={onBlur} />;

    case 'custom':
      return (
        <CustomSelect
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
          firstVisibleFieldName={firstVisibleFieldName}
          onFieldBlur={onBlur}
          field={field}
          extensionManifest={extensionManifest}
          parameters={pickUsedParameters(parameters, field.fields)}
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

        if (canRemoveFields) {
          if (!onClickRemove) {
            return <Fragment key={name}>{fieldElement}</Fragment>;
          }

          return (
            <RemovableField
              key={name}
              name={name}
              onClickRemove={() => onClickRemove(name)}
            >
              {fieldElement}
            </RemovableField>
          );
        }

        return <FieldWrapper key={name}>{fieldElement}</FieldWrapper>;
      })}
    </Fragment>
  );
}
