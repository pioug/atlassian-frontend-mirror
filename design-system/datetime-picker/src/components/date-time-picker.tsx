import { fg } from '@atlaskit/platform-feature-flags';

import { componentWithCondition } from '../internal/ff-component';

import DateTimePickerOld from './date-time-picker-class';
import DateTimePickerNew from './date-time-picker-fc';

const DateTimePicker = componentWithCondition(
	() => fg('dst-date-time-picker-use-functional-component'),
	DateTimePickerNew,
	DateTimePickerOld,
);
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default DateTimePicker;
