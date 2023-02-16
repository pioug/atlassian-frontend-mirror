import React, { useCallback, useState } from 'react';

import LocaleSelect, { Locale } from '@atlaskit/locale/LocaleSelect';
import Select, { ValueType } from '@atlaskit/select';

import Calendar from '../src';
import type { WeekDay } from '../src/types';

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

  const onBlur = () => log('Blur');
  const onChange = () => log('Change');
  const onFocus = () => log('Focus');
  const onSelect = () => log('Select');

  const styles = {
    container: (css: {}) => ({ ...css, width: 300, margin: '0.5em 0' }),
    dropdownIndicator: (css: {}) => ({ ...css, paddingLeft: 0 }),
    menu: (css: {}) => ({ ...css, width: 300 }),
  };

  return (
    <div>
      <Calendar
        disabled={['2020-12-04']}
        defaultPreviouslySelected={['2020-12-06']}
        defaultSelected={['2020-12-08']}
        defaultMonth={12}
        defaultYear={2020}
        style={{
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          border: '1px solid red',
          display: 'inline-block',
        }}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onSelect={onSelect}
        locale={locale}
        weekStartDay={weekStartDay}
        testId="test"
      />
      <LocaleSelect onLocaleChange={handleLocaleChange} />
      <Select<WeekStartDayOption>
        inputId="week-start-day"
        styles={styles}
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
