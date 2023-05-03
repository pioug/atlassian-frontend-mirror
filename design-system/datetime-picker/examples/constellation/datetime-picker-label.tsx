import React, { useState } from 'react';

import { IntlProvider, useIntl } from 'react-intl-next';

import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select';

import { DateTimePicker } from '../../src';

type Locale = 'en-us' | 'es-419';
type Locales<Type> = {
  [Property in Locale]: Type;
};
type LocaleMessages = {
  legend: string;
  date: string;
  time: string;
};
type Messages = Locales<LocaleMessages>;

const messages: Messages = {
  'en-us': {
    legend: 'Scheduled Run Time',
    date: 'Date',
    time: 'Time',
  },
  'es-419': {
    legend: 'Tiempo de ejecución programado',
    date: 'Fecha',
    time: 'Tiempo',
  },
};

const DateTimePickerIntlProvider = () => {
  const [lang, setLang] = useState<Locale>('en-us');

  return (
    <>
      <Field name="language" label="Language">
        {({ fieldProps }) => (
          <Select
            inputId={fieldProps.id}
            onChange={(selection) => setLang(selection?.value as Locale)}
            options={[
              { label: 'English', value: 'en-us' },
              { label: 'Spanish', value: 'es-419' },
            ]}
            placeholder="Choose a language"
          />
        )}
      </Field>
      <IntlProvider locale={lang} key={lang} messages={messages[lang]}>
        <DateTimePickerWithInternationalizedLabels />
      </IntlProvider>
    </>
  );
};

const DateTimePickerWithInternationalizedLabels = () => {
  const intl = useIntl();

  return (
    <>
      <Field
        name="datetime-picker"
        label={intl.formatMessage({ id: 'legend' })}
      >
        {({ fieldProps }) => (
          <DateTimePicker
            {...fieldProps}
            datePickerSelectProps={{
              inputId: fieldProps.id,
              'aria-label': intl.formatMessage({ id: 'date' }),
            }}
            timePickerSelectProps={{
              inputId: fieldProps.id,
              'aria-label': intl.formatMessage({ id: 'time' }),
            }}
          />
        )}
      </Field>
    </>
  );
};

export default DateTimePickerIntlProvider;
