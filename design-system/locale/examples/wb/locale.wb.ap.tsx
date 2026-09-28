import { wb, type WorkbenchExample } from '@atlassian/workbench';

import OverviewExample from '../0-overview';
import DateParserExample from '../1-date-parser';
import FormatDateExample from '../2-format-date';
import FormatTimeExample from '../3-format-time';
import ShortDaysExample from '../4-short-days';
import LongMonthsExample from '../5-long-months';
import FormatToPartsExample from '../6-format-to-parts';

export const Overview: WorkbenchExample<typeof OverviewExample> = wb(OverviewExample);

export const DateParser: WorkbenchExample<typeof DateParserExample> = wb(DateParserExample);
export const FormatDate: WorkbenchExample<typeof FormatDateExample> = wb(FormatDateExample);
export const FormatTime: WorkbenchExample<typeof FormatTimeExample> = wb(FormatTimeExample);
export const ShortDays: WorkbenchExample<typeof ShortDaysExample> = wb(ShortDaysExample);
export const LongMonths: WorkbenchExample<typeof LongMonthsExample> = wb(LongMonthsExample);
export const FormatToParts: WorkbenchExample<typeof FormatToPartsExample> =
	wb(FormatToPartsExample);
