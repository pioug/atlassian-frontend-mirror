import React, { Fragment } from 'react';
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
  getCustomFieldResolver,
} from '@atlaskit/editor-common/extensions';

import { OnBlur } from '../types';
import UnhandledType from './UnhandledType';
import FieldMessages from '../FieldMessages';
import { validate, getSafeParentedName } from '../utils';

type Props = {
  field: CustomField;
  extensionManifest: ExtensionManifest;
  onBlur: OnBlur;
  autoFocus?: boolean;
  placeholder?: string;
  parentName?: string;
} & InjectedIntlProps;

type State = {
  defaultValue?: Option | Option[];
  resolver?: CustomFieldResolver;
  isMissingResolver?: boolean;
};

function FieldError({ field }: { field: CustomField }) {
  const { type } = field.options.resolver;
  return (
    <UnhandledType
      key={field.name}
      field={field}
      errorMessage={`Field "${field.name}" can't be renderered. Missing resolver for "${type}".`}
    />
  );
}

class CustomSelect extends React.Component<Props, State> {
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

  formatCreateLabel(value: string) {
    if (!value) {
      return null;
    }
    const { intl } = this.props;
    const message = intl.formatMessage(messages.createOption);

    return `${message} "${value}"`;
  }

  render() {
    const { field, onBlur, autoFocus, placeholder, parentName } = this.props;
    const { defaultValue, resolver, isMissingResolver } = this.state;
    const { name, label, description, isMultiple, isRequired, options } = field;
    const { isCreatable } = options;

    return (
      <Field<ValueType<Option>>
        name={getSafeParentedName(name, parentName)}
        label={label}
        isRequired={isRequired}
        defaultValue={defaultValue}
        validate={(value: ValueType<Option>) =>
          validate<ValueType<Option>>(field, value)
        }
      >
        {({ fieldProps, error }) => (
          <Fragment>
            {resolver && (
              <Fragment>
                <AsyncCreatableSelect
                  {...fieldProps}
                  onChange={value => {
                    fieldProps.onChange(value);
                    onBlur(name);
                  }}
                  isMulti={isMultiple || false}
                  isClearable={true}
                  isValidNewOption={(value: string) => isCreatable && value}
                  validationState={error ? 'error' : 'default'}
                  defaultOptions={true}
                  formatCreateLabel={(value: string) =>
                    this.formatCreateLabel(value)
                  }
                  formatOptionLabel={formatOptionLabel}
                  loadOptions={(searchTerm: string) =>
                    resolver(searchTerm, field.defaultValue)
                  }
                  autoFocus={autoFocus}
                  placeholder={placeholder}
                />
                <FieldMessages error={error} description={description} />
              </Fragment>
            )}
            {isMissingResolver && <FieldError field={field} />}
          </Fragment>
        )}
      </Field>
    );
  }
}

export default injectIntl(CustomSelect);
