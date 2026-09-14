import { wb, type WorkbenchExample } from '@atlassian/workbench';

import OverviewExample from './0-overview';
import DateParserExample from './1-date-parser';
import FormatDateExample from './2-format-date';
import FormatTimeExample from './3-format-time';
import ShortDaysExample from './4-short-days';
import LongMonthsExample from './5-long-months';
import FormatToPartsExample from './6-format-to-parts';

const Overview: WorkbenchExample = wb(OverviewExample);

export default Overview;
export const DateParser: WorkbenchExample = wb(DateParserExample);
export const FormatDate: WorkbenchExample = wb(FormatDateExample);
export const FormatTime: WorkbenchExample = wb(FormatTimeExample);
export const ShortDays: WorkbenchExample = wb(ShortDaysExample);
export const LongMonths: WorkbenchExample = wb(LongMonthsExample);
export const FormatToParts: WorkbenchExample = wb(FormatToPartsExample);
