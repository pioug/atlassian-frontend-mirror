/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Label } from '@atlaskit/form';
import LocaleSelect, { type Locale } from '@atlaskit/locale/LocaleSelect';
import { Box, xcss } from '@atlaskit/primitives';
import Select, { type ValueType } from '@atlaskit/select';

import Calendar from '../../src';
import type { WeekDay } from '../../src/types';

const localeContainerStyles = xcss({ maxWidth: '300px' });
const localeInputStyles = css({ marginBlockStart: '-0.5em' });

type WeekStartDayOption = {
	value: WeekDay;
	label: string;
};

export default () => {
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
			<Box xcss={localeContainerStyles}>
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
