import React, { useEffect, useState } from 'react';

import { Field } from '@atlaskit/form';
import { SmartUserPicker, DefaultValue, Value } from '@atlaskit/user-picker';
import {
  UserField,
  UserFieldContext,
  ExtensionManifest,
  getUserFieldContextProvider,
} from '@atlaskit/editor-common/extensions';

import { OnBlur } from '../types';
import UnhandledType from './UnhandledType';

import FieldMessages from '../FieldMessages';

type Props = {
  field: UserField;
  extensionManifest: ExtensionManifest;
  onBlur: OnBlur;
  autoFocus?: boolean;
};

type FieldValue = UserField['defaultValue'];

function makeCompat(defaultValue: FieldValue): DefaultValue {
  if (!defaultValue) {
    return null;
  }
  if (Array.isArray(defaultValue)) {
    return defaultValue.map(id => ({ type: 'user', id }));
  }
  return { type: 'user', id: defaultValue };
}

function makeSafe(value: Value | DefaultValue): FieldValue {
  if (!value) {
    return null;
  }
  if (Array.isArray(value)) {
    const ids = [];
    for (const { id } of value) {
      ids.push(id);
    }
    return ids;
  }
  return value.id;
}

export default function UserSelect({
  autoFocus,
  extensionManifest,
  field,
  onBlur,
}: Props) {
  const [context, setContext] = useState({} as Partial<UserFieldContext>);
  const {
    name,
    label,
    defaultValue,
    description,
    placeholder,
    isMultiple,
    isRequired,
    options,
  } = field;
  const { type } = options.provider;
  const {
    siteId,
    principalId,
    fieldId,
    productKey,
    containerId,
    objectId,
    childObjectId,
    productAttributes,
    includeUsers = true,
    includeGroups = false,
    includeTeams = false,
  } = context;

  useEffect(() => {
    async function fetchContext() {
      try {
        const context = await (
          await getUserFieldContextProvider(
            extensionManifest,
            field.options.provider,
          )
        )();

        setContext(context);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    fetchContext();
  }, [extensionManifest, field.options.provider]);

  return (
    <Field<FieldValue>
      name={name}
      label={label}
      isRequired={isRequired}
      defaultValue={defaultValue}
      validate={(value: any) => {}}
    >
      {({ fieldProps, error }) => {
        // if any of these don't exists, the provider is missing
        if (!siteId || !principalId || !fieldId || !productKey) {
          return (
            <UnhandledType
              key={name}
              field={field}
              errorMessage={`Field "${name}" can't be renderered. Missing provider for "${type}".`}
            />
          );
        }

        function onChange(value: Value) {
          fieldProps.onChange(makeSafe(value));
          onBlur(name);
        }

        const { value, ...fieldPropsRest } = fieldProps;
        return (
          <>
            <SmartUserPicker
              {...fieldPropsRest}
              onChange={onChange}
              autoFocus={autoFocus}
              onBlur={() => onBlur(name)}
              defaultValue={makeCompat(value)}
              maxOptions={10}
              isClearable={true}
              isMulti={isMultiple}
              includeUsers={includeUsers}
              includeGroups={includeGroups}
              includeTeams={includeTeams}
              fieldId={fieldId}
              principalId={principalId}
              siteId={siteId}
              productKey={productKey}
              objectId={objectId}
              containerId={containerId}
              childObjectId={childObjectId}
              placeholder={placeholder}
              productAttributes={productAttributes}
              width="100%"
            />
            <FieldMessages error={error} description={description} />
          </>
        );
      }}
    </Field>
  );
}
