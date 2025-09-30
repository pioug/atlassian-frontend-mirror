import type { FC, RefAttributes } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import type { DatePickerProps } from '../index';
import { componentWithCondition } from '../internal/ff-component';

import DatePickerOld from './date-picker-class';
import DatePickerNew from './date-picker-fc';

const DatePicker: FC<React.PropsWithoutRef<DatePickerProps> & RefAttributes<HTMLElement>> =
	componentWithCondition(
		() => fg('dst-date-picker-use-functional-component'),
		DatePickerNew,
		DatePickerOld,
	);
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default DatePicker;
