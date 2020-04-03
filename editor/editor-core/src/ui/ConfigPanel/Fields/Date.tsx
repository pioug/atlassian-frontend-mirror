import React, { Fragment } from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { Field } from '@atlaskit/form';
import { DatePicker } from '@atlaskit/datetime-picker';
import { DateField } from '@atlaskit/editor-common/extensions';

import FieldMessages from '../FieldMessages';
import { validate } from '../utils';

const Date = function({
  field,
  intl,
}: { field: DateField } & InjectedIntlProps) {
  const element = (
    <Field
      name={field.name}
      label={field.label}
      defaultValue={field.defaultValue || ''}
      isRequired={field.isRequired}
      validate={(value?: string) => validate<string>(field, value || '')}
    >
      {({ fieldProps, error, valid }) => (
        <Fragment>
          <DatePicker {...fieldProps} locale={intl.locale} />
          <FieldMessages error={error} description={field.description} />
        </Fragment>
      )}
    </Field>
  );

  return element;
};

export default injectIntl(Date);
