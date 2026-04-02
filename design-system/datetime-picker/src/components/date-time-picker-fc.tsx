import { fg } from '@atlaskit/platform-feature-flags';

import { componentWithCondition } from '../internal/ff-component';

import DateTimePickerNew from './date-time-picker-fc-new';
import DateTimePickerOld from './date-time-picker-fc-old';

/**
 * __Date time picker__
 *
 * A date time picker allows the user to select an associated date and time.
 *
 * - [Examples](https://atlassian.design/components/datetime-picker/examples)
 * - [Code](https://atlassian.design/components/datetime-picker/code)
 * - [Usage](https://atlassian.design/components/datetime-picker/usage)
 */
export default componentWithCondition(
	() => fg('dst-a11y_fix-dtp-value-calculation'),
	DateTimePickerNew,
	DateTimePickerOld,
);
