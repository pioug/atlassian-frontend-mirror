import type { ClassNamesState } from '../types';

/**
 * String representation of component state for styling with class names.
 *
 * Expects an array of strings OR a string/object pair:
 * - className(['comp', 'comp-arg', 'comp-arg-2'])
 * @returns 'react-select__comp react-select__comp-arg react-select__comp-arg-2'
 * - className('comp', { some: true, state: false })
 * @returns 'react-select__comp react-select__comp--some'
 */
function applyPrefixToName(prefix: string, name: string) {
	if (!name) {
		return prefix;
	} else if (name[0] === '-') {
		return prefix + name;
	} else {
		return prefix + '__' + name;
	}
}

export function classNames(
	prefix?: string | null,
	state?: ClassNamesState,
	...classNameList: string[]
): string {
	const arr = [...classNameList];
	if (state && prefix) {
		for (let key in state) {
			if (state.hasOwnProperty(key) && state[key]) {
				arr.push(`${applyPrefixToName(prefix, key)}`);
			}
		}
	}

	return arr
		.filter((i) => i)
		.map((i) => String(i).trim())
		.join(' ');
}
