import React, { useCallback, useState } from 'react';

import LocaleSelect, { Locale } from '@atlaskit/locale/LocaleSelect';
import Select, { ValueType } from '@atlaskit/select';

import Calendar from '../src';
import { WeekDay } from '../src/internal/types';

const log = (msg: string) => (e: any) => console.log(msg, e);

type WeekStartDayOption = {
  value: WeekDay;
  label: string;
};

export default () => {
  const [locale, setLocale] = useState('en-AU');
  const [weekStartDay, setWeekStartDay] = useState<WeekDay>(0);

  const handleLocaleChange = useCallback(
    (locale: Locale) => setLocale(locale.value),
    [],
  );

  const handleWeekStartDayChange = useCallback(
    (weekStartDayValue: ValueType<WeekStartDayOption>) =>
      setWeekStartDay((weekStartDayValue as WeekStartDayOption).value),
    [],
  );

  return (
    <div>
      <Calendar
        defaultDisabled={['2020-12-04']}
        defaultPreviouslySelected={['2020-12-06']}
        defaultSelected={['2020-12-08']}
        defaultMonth={12}
        defaultYear={2020}
        style={{
          border: '1px solid red',
          display: 'inline-block',
        }}
        onBlur={() => log('blur')}
        onChange={() => log('change')}
        onFocus={() => log('focus')}
        onSelect={() => log('select')}
        locale={locale}
        weekStartDay={weekStartDay}
        testId="test"
      />
      <LocaleSelect onLocaleChange={handleLocaleChange} />
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
    </div>
  );
};
