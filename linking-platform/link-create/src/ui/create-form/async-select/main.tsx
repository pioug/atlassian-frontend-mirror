/** @jsx jsx */
import { useEffect, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';
import debounce from 'debounce-promise';
import { useForm } from 'react-final-form';

import {
  AsyncSelect as AkAsyncSelect,
  GroupType,
  OptionType,
} from '@atlaskit/select';

import { CreateField } from '../../../controllers/create-field';

import { AsyncSelectProps } from './types';

export const TEST_ID = 'link-create-async-select';

/**
 * An async select utilising the Atlaskit AsyncSelect and CreateField.
 * Validation is handled by the form on form submission. Any
 * errors returned by the handleSubmit function passed to the form <Form> that
 * have a key matching the `name` of this field are shown below the field.
 */
export function AsyncSelect<T = OptionType>({
  id,
  name,
  label,
  isRequired,
  validators,
  validationHelpText,
  testId = TEST_ID,
  defaultOption: propsDefaultValue,
  loadOptions,
  ...restProps
}: AsyncSelectProps<T>) {
  const { mutators } = useForm();

  const [defaultValue, setDefaultValue] =
    useState<typeof propsDefaultValue>(propsDefaultValue);
  const [isLoadingDefaultOptions, setIsLoadingDefaultOptions] = useState(false);

  const [defaultOptions, setDefaultOptions] = useState<T[] | GroupType<T>[]>(
    [],
  );

  useEffect(() => {
    let current = true;

    const fetch = async (query: string = '') => {
      if (!loadOptions) {
        return;
      }
      try {
        /**
         * If we are fetching default options, clear the
         * value the user has set
         */
        if (mutators.setField) {
          mutators.setField(name, null);
        }
        setIsLoadingDefaultOptions(true);
        setDefaultOptions([]);
        const options = await loadOptions(query);
        if (current) {
          setDefaultOptions(options);
          setIsLoadingDefaultOptions(false);
        }
      } catch (err) {
        if (current) {
          setIsLoadingDefaultOptions(false);
        }
      }
    };

    fetch();

    return () => {
      current = false;
    };
  }, [
    loadOptions,
    setIsLoadingDefaultOptions,
    setDefaultOptions,
    mutators,
    name,
  ]);

  useEffect(() => {
    /**
     * Mutate the form state to set a default value for this field
     * if `defaultOption` is a prop and we have not set a value for it yet
     */
    if (!defaultValue && propsDefaultValue) {
      setDefaultValue(propsDefaultValue);

      if (mutators.setField) {
        mutators.setField(name, propsDefaultValue);
      }
    }
  }, [defaultValue, propsDefaultValue, name, mutators]);

  const debouncedLoadOptions = useMemo(
    () => (loadOptions ? debounce(loadOptions, 300) : undefined),
    [loadOptions],
  );

  return (
    <CreateField
      id={id}
      name={name}
      label={label}
      isRequired={isRequired}
      validators={validators}
      validationHelpText={validationHelpText}
      testId={testId}
    >
      {({ fieldId, ...fieldProps }) => {
        return (
          <AkAsyncSelect<T>
            inputId={fieldId}
            {...fieldProps}
            {...restProps}
            loadOptions={debouncedLoadOptions}
            defaultOptions={defaultOptions}
            isLoading={isLoadingDefaultOptions}
          />
        );
      }}
    </CreateField>
  );
}
