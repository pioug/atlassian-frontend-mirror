import React from 'react';

import { Label } from '@atlaskit/field-base';
import LocaleSelect, { Locale } from '@atlaskit/locale/LocaleSelect';
import Select, { ValueType } from '@atlaskit/select';

import {
  DatePicker,
  DatePickerProps,
  DateTimePicker,
  TimePicker,
} from '../src';

const onChange = (value: string) => {
  console.log(value);
};

type WeekStartDayOption = {
  value: DatePickerProps['weekStartDay'];
  label: string;
};

export default () => {
  const [locale, setLocale] = React.useState('ja-JP');
  const [weekStartDay, setWeekStartDay] = React.useState<
    DatePickerProps['weekStartDay']
  >(0);

  const handleLocaleChange = React.useCallback(
    (newLocale: Locale) => setLocale(newLocale.value),
    [],
  );

  const handleWeekStartDayChange = React.useCallback(
    (weekStartDayValue: ValueType<WeekStartDayOption>) =>
      setWeekStartDay((weekStartDayValue as WeekStartDayOption).value),
    [],
  );

  return (
    <div>
      <Label label="Locale" />
      <LocaleSelect
        onLocaleChange={handleLocaleChange}
        defaultLocale={{ value: 'ja-JP', label: '日本語 (日本)' }}
      />

      <Label label="Start day of the week" />
      <Select<WeekStartDayOption>
        inputId="week-start-day"
        styles={{
          container: (css: {}) => ({ ...css, width: 300, margin: '0.5em 0' }),
          dropdownIndicator: (css: {}) => ({ ...css, paddingLeft: 0 }),
          menu: (css: {}) => ({ ...css, width: 300 }),
        }}
        options={[
          { label: 'Sunday', value: 0 },
          { label: 'Monday', value: 1 },
          { label: 'Tuesday', value: 2 },
          { label: 'Wednesday', value: 3 },
          { label: 'Thursday', value: 4 },
          { label: 'Friday', value: 5 },
          { label: 'Saturday', value: 6 },
        ]}
        placeholder="Choose start day of the week"
        onChange={handleWeekStartDayChange}
      />

      <h3>Date picker</h3>
      <Label label="default" />
      <DatePicker
        id="datepicker-1"
        onChange={onChange}
        locale={locale}
        testId={'date-picker'}
        weekStartDay={weekStartDay}
        defaultValue="2021-01-01"
      />

      <h3>Time picker</h3>
      <Label label="default" />
      <TimePicker
        id="timepicker-1"
        onChange={onChange}
        selectProps={{ classNamePrefix: 'time-picker--select' }}
        locale={locale}
        testId={'time-picker'}
        timeIsEditable
      />

      <h3>Date / time picker</h3>
      <Label label="default" />
      <DateTimePicker
        id="datetimepicker-1"
        onChange={onChange}
        locale={locale}
        testId={'datetime-picker'}
        defaultValue="2021-01-01"
        datePickerProps={{
          weekStartDay,
        }}
        datePickerSelectProps={{
          classNamePrefix: 'date-picker--select',
        }}
      />
    </div>
  );
};
