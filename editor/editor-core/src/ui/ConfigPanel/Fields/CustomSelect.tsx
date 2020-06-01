import React, { Fragment } from 'react';

import { Field } from '@atlaskit/form';
import { AsyncSelect, ValueType } from '@atlaskit/select';

import {
  getFieldResolver,
  FieldResolver,
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
};

type State = {
  defaultValue?: Option | Option[];
  fieldResolver?: FieldResolver;
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
    await this.getFieldResolver();
    await this.fetchDefaultValues();
  }

  setDefaultValue = (defaultValue: Option | Option[]) => {
    this.setState(state => ({
      ...state,
      defaultValue,
    }));
  };

  async getFieldResolver() {
    const { extensionManifest, field } = this.props;

    try {
      const fieldResolver = await getFieldResolver(
        extensionManifest,
        field.options.resolver,
      );

      this.setState(state => ({
        ...state,
        fieldResolver,
        isMissingResolver: !fieldResolver,
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
    const { fieldResolver } = this.state;

    if (!fieldResolver) {
      return;
    }

    const options = await fieldResolver();

    if (field.defaultValue && field.isMultiple) {
      this.setDefaultValue(
        options.filter(option =>
          (field.defaultValue as string[]).includes(option.value),
        ),
      );
    }

    if (field.defaultValue && !field.isMultiple) {
      this.setDefaultValue(
        options.find(
          option => (field.defaultValue as string) === option.value,
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
    const { field, onBlur, autoFocus } = this.props;
    const { defaultValue, fieldResolver, isMissingResolver } = this.state;

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
            {fieldResolver && (
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
                  loadOptions={fieldResolver}
                  autoFocus={autoFocus}
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
