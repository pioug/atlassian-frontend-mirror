import React, { useEffect, useState } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '../messages';

import { Field } from '@atlaskit/form';
import { AsyncCreatableSelect, ValueType } from '@atlaskit/select';
import { formatOptionLabel } from './SelectItem';

import {
  CustomField,
  CustomFieldResolver,
  ExtensionManifest,
  Option,
  Parameters,
  getCustomFieldResolver,
} from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import UnhandledType from './UnhandledType';
import { OnFieldChange } from '../types';
import { validate } from '../utils';

function FieldError({ name, field }: { name: string; field: CustomField }) {
  const { type } = field.options.resolver;
  return (
    <UnhandledType
      key={name}
      field={field}
      errorMessage={`Field "${name}" can't be rendered. Missing resolver for "${type}".`}
    />
  );
}

function CustomSelect({
  name,
  autoFocus,
  extensionManifest,
  placeholder,
  field,
  onFieldChange,
  parameters,
  intl,
}: {
  name: string;
  field: CustomField;
  extensionManifest: ExtensionManifest;
  onFieldChange: OnFieldChange;
  autoFocus?: boolean;
  placeholder?: string;
  parameters?: Parameters;
} & InjectedIntlProps) {
  const {
    defaultValue: fieldDefaultValue,
    description,
    isMultiple,
    isRequired,
    label,
    options,
  } = field;
  const [loading, setLoading] = useState(true);
  const [resolver, setResolver] = useState<CustomFieldResolver | null>(null);
  const [defaultOptions, setDefaultOptions] = useState([] as Option[]);
  const [defaultValue, setDefaultValue] = useState<
    Option | Option[] | undefined
  >(undefined);

  useEffect(() => {
    let cancel = false;

    async function fetchResolver() {
      setLoading(true);

      try {
        const resolver = await getCustomFieldResolver(
          extensionManifest,
          field.options.resolver,
        );

        if (cancel) {
          return;
        }
        setResolver(() => resolver);

        // fetch the default values
        const options = await resolver(
          undefined,
          fieldDefaultValue,
          parameters,
        );
        setDefaultOptions(options);
        if (cancel) {
          return;
        }

        // filter returned values to match the defaultValue
        if (fieldDefaultValue && isMultiple) {
          setDefaultValue(
            options.filter((option: Option) =>
              (fieldDefaultValue as string[]).includes(option.value),
            ),
          );
        }

        if (fieldDefaultValue && !isMultiple) {
          setDefaultValue(
            options.find(
              (option: Option) =>
                (fieldDefaultValue as string) === option.value,
            ),
          );
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }

      setLoading(false);
    }

    fetchResolver();
    return () => {
      cancel = true;
    };
  }, [
    extensionManifest,
    field.options.resolver,
    fieldDefaultValue,
    isMultiple,
    parameters,
  ]);

  function formatCreateLabel(value: string) {
    if (!value) {
      return null;
    }
    const message = intl.formatMessage(messages.createOption);

    return `${message} "${value}"`;
  }

  const { isCreatable } = options;
  return (
    <Field<ValueType<Option>>
      name={name}
      label={label}
      isRequired={isRequired}
      defaultValue={defaultValue as ValueType<Option, false>}
      validate={(value) => validate(field, value)}
    >
      {({ fieldProps, error }) => (
        <>
          {resolver && (
            <>
              <AsyncCreatableSelect
                {...fieldProps}
                onChange={(value) => {
                  fieldProps.onChange(value);
                  // We assume onChange is called whenever values actually changed
                  // for isDirty
                  onFieldChange(name, true);
                }}
                // @see DST-2386 & ED-12503
                enableAnimation={false}
                // add type cast to avoid adding a "IsMulti" generic prop (TODO: ED-12072)
                isMulti={(isMultiple || false) as false}
                isClearable={true}
                isValidNewOption={(value: string) => isCreatable && value}
                validationState={error ? 'error' : 'default'}
                defaultOptions={defaultOptions}
                formatCreateLabel={(value: string) => formatCreateLabel(value)}
                formatOptionLabel={formatOptionLabel}
                loadOptions={(searchTerm: string) => {
                  return resolver(searchTerm, fieldDefaultValue, parameters);
                }}
                autoFocus={autoFocus}
                placeholder={placeholder}
              />
              <FieldMessages error={error} description={description} />
            </>
          )}
          {!loading && !resolver && <FieldError name={name} field={field} />}
        </>
      )}
    </Field>
  );
}

export default injectIntl(CustomSelect);
