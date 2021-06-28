import React, { Fragment, useState, useEffect, useMemo } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import styled from 'styled-components';

import { Field } from '@atlaskit/form';
import { RadioGroup } from '@atlaskit/radio';
import { DatePicker } from '@atlaskit/datetime-picker';
import TextField from '@atlaskit/textfield';
import {
  DateRangeField,
  DateRangeResult,
} from '@atlaskit/editor-common/extensions';

import { messages } from '../messages';
import FieldMessages from '../FieldMessages';
import { validate, validateRequired } from '../utils';
import { OnFieldChange } from '../types';

const HorizontalFields = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HorizontalFieldWrapper = styled.div`
  flex-basis: 47%;
`;

const Hidden = styled.div`
  display: none;
`;

const getFromDefaultValue = (
  field: DateRangeField,
  attribute: keyof DateRangeResult,
): string | undefined => {
  if (field.defaultValue) {
    return field.defaultValue[attribute];
  }
};

const DateField = ({
  parentField,
  scope,
  fieldName,
  onFieldChange,
  intl,
  isRequired,
}: {
  parentField: DateRangeField;
  scope: string;
  fieldName: 'from' | 'to';
  onFieldChange: OnFieldChange;
  isRequired?: boolean;
} & InjectedIntlProps) => (
  <HorizontalFieldWrapper key={fieldName}>
    <Field
      name={`${scope}.${fieldName}`}
      label={intl.formatMessage(messages[fieldName])}
      defaultValue={getFromDefaultValue(
        parentField,
        fieldName as keyof DateRangeResult,
      )}
      isRequired={isRequired}
      validate={(value?: string) => {
        return validateRequired<string | undefined>({ isRequired }, value);
      }}
    >
      {({ fieldProps, error }) => (
        <Fragment>
          <DatePicker
            {...fieldProps}
            onChange={(date: string) => {
              fieldProps.onChange(date);
              onFieldChange(parentField.name, true);
            }}
            locale={intl.locale}
          />
          <FieldMessages error={error} />
        </Fragment>
      )}
    </Field>
  </HorizontalFieldWrapper>
);

const DateRange = function ({
  name,
  field,
  onFieldChange,
  intl,
}: {
  name: string;
  field: DateRangeField;
  onFieldChange: OnFieldChange;
  autoFocus?: boolean;
  placeholder?: string;
} & InjectedIntlProps) {
  const items = useMemo(() => {
    return [
      ...(field.items || []),
      {
        label: intl.formatMessage(messages.custom),
        value: 'custom',
      },
    ].map((option) => ({
      ...option,
      name,
    }));
  }, [field.items, name, intl]);

  const [currentValue, setCurrentValue] = useState(
    getFromDefaultValue(field, 'value') || items[0].value,
  );

  useEffect(() => {
    // calling onBlur here based on the currentValue changing will ensure that we
    // get the most up to date value after the form has been rendered
    onFieldChange(name, true);
  }, [currentValue, onFieldChange, name]);

  const element = (
    <Fragment>
      <Hidden>
        <Field name={`${name}.type`} defaultValue={'date-range'}>
          {({ fieldProps }) => <TextField {...fieldProps} type="hidden" />}
        </Field>
      </Hidden>
      <Field
        name={`${name}.value`}
        label={field.label}
        defaultValue={currentValue}
        isRequired={field.isRequired}
        validate={(value?: string) => validate<string>(field, value || '')}
      >
        {({ fieldProps, error }) => (
          <Fragment>
            <RadioGroup
              {...fieldProps}
              options={items}
              onChange={(event) => {
                fieldProps.onChange(event.target.value);
                setCurrentValue(event.target.value);
              }}
            />
            <FieldMessages error={error} />
          </Fragment>
        )}
      </Field>
      {currentValue !== 'custom' ? (
        <Hidden>
          {/** this is a hidden field that will copy the selected value to a field of name 'from'
           *  when a option that is NOT 'custom' is selected. This is to comply with the atlaskit
           * form component that relies on final-form */}
          <Field name={`${name}.from`} defaultValue={currentValue}>
            {({ fieldProps }) => <TextField {...fieldProps} type="hidden" />}
          </Field>
        </Hidden>
      ) : (
        <HorizontalFields>
          <DateField
            scope={name}
            parentField={field}
            fieldName="from"
            onFieldChange={onFieldChange}
            intl={intl}
            isRequired={field.isRequired}
          />
          <DateField
            scope={name}
            parentField={field}
            fieldName="to"
            onFieldChange={onFieldChange}
            intl={intl}
            isRequired={field.isRequired}
          />
        </HorizontalFields>
      )}

      <FieldMessages description={field.description} />
    </Fragment>
  );

  return element;
};

export default injectIntl(DateRange);
