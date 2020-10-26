import React, { Fragment } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { Field } from '@atlaskit/form';
import { DatePicker } from '@atlaskit/datetime-picker';
import { DateField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate, getSafeParentedName } from '../utils';
import { OnBlur } from '../types';

const Date = function ({
  field,
  onBlur,
  autoFocus,
  intl,
  placeholder,
  parentName,
}: {
  field: DateField;
  onBlur: OnBlur;
  autoFocus?: boolean;
  placeholder?: string;
  parentName?: string;
} & InjectedIntlProps) {
  const element = (
    <Field
      name={getSafeParentedName(field.name, parentName)}
      label={field.label}
      defaultValue={field.defaultValue || ''}
      isRequired={field.isRequired}
      validate={(value?: string) => validate<string>(field, value || '')}
    >
      {({ fieldProps, error, valid }) => (
        <Fragment>
          <DatePicker
            {...fieldProps}
            autoFocus={autoFocus}
            onBlur={() => {
              fieldProps.onBlur();
              onBlur(field.name);
            }}
            locale={intl.locale}
            placeholder={placeholder}
          />
          <FieldMessages error={error} description={field.description} />
        </Fragment>
      )}
    </Field>
  );

  return element;
};

export default injectIntl(Date);
