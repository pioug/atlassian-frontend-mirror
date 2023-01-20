/* eslint-disable @repo/internal/react/use-primitives */
import React, { useCallback, useState } from 'react';

import LocaleSelect, { Locale } from '@atlaskit/locale/LocaleSelect';
import Select, { ValueType } from '@atlaskit/select';

import Calendar from '../../src';
import type { WeekDay } from '../../src/types';

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
        disabled={['2020-12-04']}
        defaultPreviouslySelected={['2020-12-06']}
        defaultSelected={['2020-12-08']}
        defaultMonth={12}
        defaultYear={2020}
        locale={locale}
        weekStartDay={weekStartDay}
        testId="test"
      />
      <div style={{ maxWidth: '300px' }}>
        <label htmlFor="week-start-day">Locale</label>
        <LocaleSelect onLocaleChange={handleLocaleChange} />
        <label htmlFor="week-start-day">Start of the week</label>
        <Select<WeekStartDayOption>
          inputId="week-start-day"
          // styles={styles}
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
    </div>
  );
};
