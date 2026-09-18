/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import memoizeOne, { type MemoizedFn } from 'memoize-one';

import { type Option, type OptionData, type Value, type DefaultValue } from '../types';
import { optionToSelectableOption } from './optionToSelectableOption';

export const getOptions: MemoizedFn<(options: OptionData[]) => Option[]> = memoizeOne(
	(options: OptionData[]): Option[] => options.map(optionToSelectableOption),
);

export interface OptionToSelectableOptions {
	(defaultValue: OptionData): Option;
	(defaultValue: OptionData[]): Option[];
	(defaultValue?: null): null;
	(defaultValue?: DefaultValue): Option | Option[] | null | undefined;
}

export const optionToSelectableOptions = memoizeOne((defaultValue: Value) => {
	if (!defaultValue) {
		return null;
	}
	if (Array.isArray(defaultValue)) {
		return defaultValue.map(optionToSelectableOption);
	}
	return optionToSelectableOption(defaultValue);
}) as OptionToSelectableOptions;

/**
 * @deprecated Use `import { isExternalUser } from '@atlaskit/user-picker/is-external-user'` instead.
 */
export { isExternalUser } from './isExternalUser';
/**
 * @deprecated Use `import { isUser } from '@atlaskit/user-picker/is-user'` instead.
 */
export { isUser } from './isUser';
/**
 * @deprecated Use `import { isTeam } from '@atlaskit/user-picker/is-team'` instead.
 */
export { isTeam } from './isTeam';
/**
 * @deprecated Use `import { isGroup } from '@atlaskit/user-picker/is-group'` instead.
 */
export { isGroup } from './isGroup';
/**
 * @deprecated Use `import { isEmail } from '@atlaskit/user-picker/is-email'` instead.
 */
export { isEmail } from './isEmail';
/**
 * @deprecated Use `import { isCustom } from '@atlaskit/user-picker/is-custom'` instead.
 */
export { isCustom } from './isCustom';
/**
 * @deprecated Use `import { isDefaultValuePopulated } from '@atlaskit/user-picker/is-default-value-populated'` instead.
 */
export { isDefaultValuePopulated } from './isDefaultValuePopulated';
/**
 * @deprecated Use `import { optionToSelectableOption } from '@atlaskit/user-picker/option-to-selectable-option'` instead.
 */
export { optionToSelectableOption } from './optionToSelectableOption';
/**
 * @deprecated Use `import { extractOptionValue } from '@atlaskit/user-picker/extract-option-value'` instead.
 */
export { extractOptionValue } from './extractOptionValue';
/**
 * @deprecated Use `import { isIterable } from '@atlaskit/user-picker/is-iterable'` instead.
 */
export { isIterable } from './isIterable';
/**
 * @deprecated Use `import { getAvatarSize } from '@atlaskit/user-picker/get-avatar-size'` instead.
 */
export { getAvatarSize } from './getAvatarSize';
/**
 * @deprecated Use `import { isChildInput } from '@atlaskit/user-picker/is-child-input'` instead.
 */
export { isChildInput } from './isChildInput';
/**
 * @deprecated Use `import { isSingleValue } from '@atlaskit/user-picker/is-single-value'` instead.
 */
export { isSingleValue } from './isSingleValue';
/**
 * @deprecated Use `import { hasValue } from '@atlaskit/user-picker/has-value'` instead.
 */
export { hasValue } from './hasValue';
/**
 * @deprecated Use `import { callCallback } from '@atlaskit/user-picker/call-callback'` instead.
 */
export { callCallback } from './callCallback';
/**
 * @deprecated Use `import { getAvatarUrl } from '@atlaskit/user-picker/get-avatar-url'` instead.
 */
export { getAvatarUrl } from './getAvatarUrl';
/**
 * @deprecated Use `import { isPopupUserPickerByComponent } from '@atlaskit/user-picker/is-popup-user-picker-by-component'` instead.
 */
export { isPopupUserPickerByComponent } from './isPopupUserPickerByComponent';
/**
 * @deprecated Use `import { isPopupUserPickerByProps } from '@atlaskit/user-picker/is-popup-user-picker-by-props'` instead.
 */
export { isPopupUserPickerByProps } from './isPopupUserPickerByProps';
/**
 * @deprecated Use `import { isLozengeText } from '@atlaskit/user-picker/is-lozenge-text'` instead.
 */
export { isLozengeText } from './isLozengeText';
