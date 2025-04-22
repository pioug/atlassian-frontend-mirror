import memoizeOne from 'memoize-one';
import { ClearIndicator } from './ClearIndicator';
import { MultiValue } from './MultiValue';
import { MultiValueContainer } from './MultiValueContainer';
import { Option } from './Option';
import { SingleValue } from './SingleValue';
import { Input } from './Input';
import { SingleValueContainer } from './SingleValueContainer';
import { PopupInput } from './PopupInput';
import { PopupControl } from './PopupControl';
import { Menu } from './Menu';
import Control from './Control';

/**
 * Memoize getComponents to avoid rerenders.
 */
export const getComponents = memoizeOne(
	(multi?: boolean, anchor?: React.ComponentType<any>, showClearIndicator?: boolean) => {
		if (anchor) {
			return {
				Control: anchor,
				Option,
			};
		} else {
			return {
				MultiValue,
				DropdownIndicator: null,
				SingleValue,
				ClearIndicator: showClearIndicator || !multi ? ClearIndicator : null,
				Option,
				ValueContainer: multi ? MultiValueContainer : SingleValueContainer,
				Input,
				Menu,
				Control,
			};
		}
	},
);

export const getPopupComponents = memoizeOne((hasPopupTitle: boolean) => {
	const baseProps = {
		DropdownIndicator: null,
		SingleValue,
		ClearIndicator,
		Option,
		ValueContainer: SingleValueContainer,
		Input: PopupInput,
	};
	if (hasPopupTitle) {
		return {
			...baseProps,
			Control: PopupControl,
		};
	}
	return baseProps;
});
