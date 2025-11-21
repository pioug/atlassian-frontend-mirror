import React, { useCallback, useState } from 'react';

import Calendar from '@atlaskit/calendar';
import type { WeekDay } from '@atlaskit/calendar/types';
import { Label } from '@atlaskit/form';
import LocaleSelect, { type Locale } from '@atlaskit/locale/LocaleSelect';
import { Stack } from '@atlaskit/primitives/compiled';
import Select, { type ValueType } from '@atlaskit/select';

const log = (msg: string) => (e: any) => console.log(msg, e);

type WeekStartDayOption = {
	value: WeekDay;
	label: string;
};

export default (): React.JSX.Element => {
	const [locale, setLocale] = useState('en-AU');
	const [weekStartDay, setWeekStartDay] = useState<WeekDay>(0);

	const handleLocaleChange = useCallback((locale: Locale) => setLocale(locale.value), []);

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
		<React.Fragment>
			<Calendar
				disabled={['2020-12-04']}
				defaultPreviouslySelected={['2020-12-06']}
				defaultSelected={['2020-12-08']}
				defaultMonth={12}
				defaultYear={2020}
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					border: '1px solid red',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
			<Stack>
				<Label htmlFor="locale">Locale</Label>
				<LocaleSelect id="locale" onLocaleChange={handleLocaleChange} />
				<Label htmlFor="week-start-day">Week Start Day</Label>
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
			</Stack>
		</React.Fragment>
	);
};
