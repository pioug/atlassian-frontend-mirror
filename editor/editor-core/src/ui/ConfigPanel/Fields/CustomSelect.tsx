import React, { Fragment } from 'react';

import { Field } from '@atlaskit/form';
import { AsyncSelect, ValueType } from '@atlaskit/select';
import { formatOptionLabel } from './SelectItem';

import {
  getCustomFieldResolver,
  CustomFieldResolver,
  ExtensionManifest,
  CustomField,
  Option,
} from '@atlaskit/editor-common/extensions';

import { OnBlur } from '../types';
import UnhandledType from './UnhandledType';
import FieldMessages from '../FieldMessages';
import { validate } from '../utils';

type Props = {
  field: CustomField;
  extensionManifest: ExtensionManifest;
  onBlur: OnBlur;
  autoFocus?: boolean;
  placeholder?: string;
};

type State = {
  defaultValue?: Option | Option[];
  resolver?: CustomFieldResolver;
  isMissingResolver?: boolean;
};

export default class CustomSelect extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isMissingResolver: false,
    };
  }

  async componentDidMount() {
    await this.getResolver();
    await this.fetchDefaultValues();
  }

  setDefaultValue = (defaultValue: Option | Option[]) => {
    this.setState(state => ({
      ...state,
      defaultValue,
    }));
  };

  async getResolver() {
    const { extensionManifest, field } = this.props;

    try {
      const resolver = await getCustomFieldResolver(
        extensionManifest,
        field.options.resolver,
      );

      this.setState(state => ({
        ...state,
        resolver,
        isMissingResolver: !resolver,
      }));
    } catch {
      this.setState(state => ({
        ...state,
        isMissingResolver: true,
      }));
    }
  }

  async fetchDefaultValues() {
    const { field } = this.props;
    const { resolver } = this.state;

    if (!resolver) {
      return;
    }

    const options = await resolver(undefined, field.defaultValue);

    if (field.defaultValue && field.isMultiple) {
      this.setDefaultValue(
        options.filter((option: Option) =>
          (field.defaultValue as string[]).includes(option.value),
        ),
      );
    }

    if (field.defaultValue && !field.isMultiple) {
      this.setDefaultValue(
        options.find(
          (option: Option) => (field.defaultValue as string) === option.value,
        ) || [],
      );
    }
  }

  renderError() {
    const { field } = this.props;
    const { type } = field.options.resolver;

    return (
      <UnhandledType
        key={field.name}
        field={field}
        errorMessage={`Field "${field.name}" can't be renderered. Missing resolver for "${type}".`}
      />
    );
  }

  render() {
    const { field, onBlur, autoFocus, placeholder } = this.props;
    const { defaultValue, resolver, isMissingResolver } = this.state;

    return (
      <Field<ValueType<Option>>
        name={field.name}
        label={field.label}
        isRequired={field.isRequired}
        defaultValue={defaultValue}
        validate={(value: ValueType<Option>) =>
          validate<ValueType<Option>>(field, value)
        }
      >
        {({ fieldProps, error }) => (
          <Fragment>
            {resolver && (
              <Fragment>
                <AsyncSelect
                  {...fieldProps}
                  onChange={value => {
                    fieldProps.onChange(value);
                    onBlur(field.name);
                  }}
                  isMulti={field.isMultiple || false}
                  isClearable={false}
                  validationState={error ? 'error' : 'default'}
                  defaultOptions={true}
                  formatOptionLabel={formatOptionLabel}
                  loadOptions={(searchTerm: string) =>
                    resolver(searchTerm, field.defaultValue)
                  }
                  autoFocus={autoFocus}
                  placeholder={placeholder}
                />
                <FieldMessages error={error} description={field.description} />
              </Fragment>
            )}
            {isMissingResolver && this.renderError()}
          </Fragment>
        )}
      </Field>
    );
  }
}
