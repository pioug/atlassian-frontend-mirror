import React, { useEffect, useState } from 'react';

import { Field, FieldProps } from '@atlaskit/form';
import {
  hydrateDefaultValues,
  SmartUserPicker,
  DefaultValue,
  Value as UnsafeValue,
} from '@atlaskit/user-picker';
import {
  UserField,
  UserFieldContext,
  ExtensionManifest,
  getUserFieldContextProvider,
} from '@atlaskit/editor-common/extensions';

import { OnFieldChange } from '../types';
import UnhandledType from './UnhandledType';
import { validate } from '../utils';

import FieldMessages from '../FieldMessages';
type FieldValue = UserField['defaultValue'];

function makeCompat(defaultValue: FieldValue): DefaultValue {
  if (!defaultValue) {
    return null;
  }
  if (Array.isArray(defaultValue)) {
    return defaultValue.map((id) => ({ type: 'user', id }));
  }
  return { type: 'user', id: defaultValue };
}

function makeSafe(value: UnsafeValue | DefaultValue): FieldValue {
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

function SafeSmartUserPicker({
  context,
  field,
  formFieldProps,
  autoFocus,
  onBlur,
  onChange,
}: {
  context: UserFieldContext;
  field: UserField;
  formFieldProps: FieldProps<FieldValue>;
  autoFocus: boolean;
  onBlur: () => void;
  onChange: (_: FieldValue) => void;
}) {
  const [unsafeValue, setUnsafeValue] = useState(null as UnsafeValue);
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
  } = context;
  const { value: safeValue, ...formFieldPropsRest } = formFieldProps;
  const { isMultiple, placeholder } = field;

  function onChangeUnsafe(newValue: UnsafeValue) {
    setUnsafeValue(newValue);
    onChange(makeSafe(newValue));
  }

  useEffect(() => {
    let cancel = false;

    async function hydrate() {
      const hydrated = await hydrateDefaultValues(
        makeCompat(safeValue),
        productKey,
      );

      if (cancel) {
        return;
      }

      setUnsafeValue(hydrated);
    }

    hydrate();

    return () => {
      cancel = true;
    };
  }, [safeValue, productKey]);

  return (
    <SmartUserPicker
      {...formFieldPropsRest}
      onChange={onChangeUnsafe}
      autoFocus={autoFocus}
      onBlur={onBlur}
      maxOptions={10}
      isClearable={true}
      isMulti={isMultiple}
      includeUsers={includeUsers}
      includeGroups={false}
      includeTeams={false}
      fieldId={fieldId}
      principalId={principalId}
      siteId={siteId}
      productKey={productKey}
      objectId={objectId}
      containerId={containerId}
      childObjectId={childObjectId}
      placeholder={placeholder}
      productAttributes={productAttributes}
      value={unsafeValue}
      width="100%"
    />
  );
}

export default function UserSelect({
  name,
  autoFocus,
  extensionManifest,
  field,
  onFieldChange,
}: {
  name: string;
  field: UserField;
  extensionManifest: ExtensionManifest;
  onFieldChange: OnFieldChange;
  autoFocus?: boolean;
}) {
  const [context, setContext] = useState({} as Partial<UserFieldContext>);
  const { siteId, principalId, fieldId, productKey } = context;
  const { label, defaultValue, description, isRequired, options } = field;
  const { type } = options.provider;

  useEffect(() => {
    let cancel = false;

    async function fetchContext() {
      try {
        const context = await (
          await getUserFieldContextProvider(
            extensionManifest,
            field.options.provider,
          )
        )();

        if (cancel) {
          return;
        }

        setContext(context);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    fetchContext();

    return () => {
      cancel = true;
    };
  }, [extensionManifest, field.options.provider]);

  return (
    <Field<FieldValue>
      name={name}
      label={label}
      isRequired={isRequired}
      defaultValue={defaultValue}
      validate={(value) => validate(field, value)}
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

        function onChange(newValue: FieldValue) {
          fieldProps.onChange(newValue);
          onFieldChange(name, true);
        }

        return (
          <>
            <SafeSmartUserPicker
              context={context as UserFieldContext}
              field={field}
              formFieldProps={fieldProps}
              autoFocus={autoFocus || false}
              onBlur={() => onFieldChange(name, true)}
              onChange={onChange}
            />
            <FieldMessages error={error} description={description} />
          </>
        );
      }}
    </Field>
  );
}
