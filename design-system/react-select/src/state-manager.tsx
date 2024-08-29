import React, {
	forwardRef,
	type MutableRefObject,
	type ReactElement,
	type RefAttributes,
} from 'react';

import Select from './select';
import { type GroupBase } from './types';
import useStateManager, { type StateManagerProps } from './use-state-manager';
export type { StateManagerProps };

/**
 * __StateManagedSelect__
 *
 * A state managed select {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
type StateManagedSelect = <
	Option = unknown,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>,
>(
	props: StateManagerProps<Option, IsMulti, Group> & RefAttributes<Select<Option, IsMulti, Group>>,
) => ReactElement;

const StateManagedSelect = forwardRef(
	<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
		props: StateManagerProps<Option, IsMulti, Group>,
		ref:
			| ((instance: Select<Option, IsMulti, Group> | null) => void)
			| MutableRefObject<Select<Option, IsMulti, Group> | null>
			| null,
	) => {
		const baseSelectProps = useStateManager(props);

		return <Select ref={ref} {...baseSelectProps} />;
	},
) as StateManagedSelect;

export default StateManagedSelect;
