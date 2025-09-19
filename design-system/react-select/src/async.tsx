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
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore: to unblock React 18.2.0 -> 18.3.1 version bump in Jira
	<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
		props: AsyncProps<Option, IsMulti, Group> & { isAsync: boolean },
		ref:
			| ((instance: Select<Option, IsMulti, Group> | null) => void)
			| MutableRefObject<Select<Option, IsMulti, Group> | null>
			| null,
	) => {
		// when isAsync is true, options are not provided and async props are used, we will enable async
		const isAsyncEnabledInBaseSelect =
			props.isAsync && !props.options && (!!props.loadOptions || !!props.defaultOptions);
		const stateManagedProps = useAsync(props);
		// when isAsync is falsy or isAsyncEnabledInBaseSelect is true, we use async props, otherwise we use base props
		let selectAsyncProps = !props.isAsync || isAsyncEnabledInBaseSelect ? stateManagedProps : props;

		const selectProps = useStateManager(selectAsyncProps);

		return <Select ref={ref} {...selectProps} />;
	},
) as AsyncSelect;

export { useAsync };

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default AsyncSelect;
