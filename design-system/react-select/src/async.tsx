import React, {
	forwardRef,
	type MutableRefObject,
	type ReactElement,
	type RefAttributes,
} from 'react';

import Select from './select';
import { type GroupBase } from './types';
import useAsync, { type AsyncProps } from './use-async';
import useStateManager from './use-state-manager';
export type { AsyncProps };

type AsyncSelect = <
	Option = unknown,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>,
>(
	props: AsyncProps<Option, IsMulti, Group> & RefAttributes<Select<Option, IsMulti, Group>>,
) => ReactElement;

const AsyncSelect = forwardRef(
	<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
		props: AsyncProps<Option, IsMulti, Group>,
		ref:
			| ((instance: Select<Option, IsMulti, Group> | null) => void)
			| MutableRefObject<Select<Option, IsMulti, Group> | null>
			| null,
	) => {
		const stateManagedProps = useAsync(props);
		const selectProps = useStateManager(stateManagedProps);

		return <Select ref={ref} {...selectProps} />;
	},
) as AsyncSelect;

export { useAsync };

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default AsyncSelect;
