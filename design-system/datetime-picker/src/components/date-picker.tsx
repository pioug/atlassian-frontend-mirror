import { fg } from '@atlaskit/platform-feature-flags';

import { componentWithCondition } from '../internal/ff-component';

import DatePickerOld from './date-picker-class';
import DatePickerNew from './date-picker-fc';

const DatePicker = componentWithCondition(
	() => fg('dst-date-picker-use-functional-component'),
	DatePickerNew,
	DatePickerOld,
);
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default DatePicker;
