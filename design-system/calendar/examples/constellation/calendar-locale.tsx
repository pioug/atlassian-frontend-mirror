/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { css } from '@compiled/react';

import Calendar from '@atlaskit/calendar';
import type { WeekDay } from '@atlaskit/calendar/types';
import { cssMap, jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form';
import LocaleSelect, { type Locale } from '@atlaskit/locale/LocaleSelect';
import { Box } from '@atlaskit/primitives/compiled';
import Select, { type ValueType } from '@atlaskit/select';

const styles = cssMap({
	localeContainer: { maxWidth: '300px' },
});

const localeInputStyles = css({ marginBlockStart: '-0.5em' });

type WeekStartDayOption = {
	value: WeekDay;
	label: string;
};

const _default: () => JSX.Element = () => {
	const [locale, setLocale] = useState('en-AU');
	const [weekStartDay, setWeekStartDay] = useState<WeekDay>(0);

	const handleLocaleChange = useCallback((locale: Locale) => setLocale(locale.value), []);

	const handleWeekStartDayChange = useCallback(
		(weekStartDayValue: ValueType<WeekStartDayOption>) =>
			setWeekStartDay((weekStartDayValue as WeekStartDayOption).value),
		[],
	);

	return (
		<Box>
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
			<Box xcss={styles.localeContainer}>
				<Label htmlFor="locale-input">Locale</Label>
				<div css={localeInputStyles}>
					<LocaleSelect id="locale-input" onLocaleChange={handleLocaleChange} />
				</div>
				<Label htmlFor="week-start-day">Start of the week</Label>
				<Select<WeekStartDayOption>
					inputId="week-start-day"
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
			</Box>
		</Box>
	);
};
export default _default;
