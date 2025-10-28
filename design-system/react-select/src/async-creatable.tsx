import React, {
	forwardRef,
	type MutableRefObject,
	type ReactElement,
	type RefAttributes,
} from 'react';

import Select from './select';
import { type GroupBase } from './types';
import useAsync, { type AsyncAdditionalProps } from './use-async';
import useCreatable, { type CreatableAdditionalProps } from './use-creatable';
import useStateManager, { type StateManagerProps } from './use-state-manager';

export type AsyncCreatableProps<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
> = StateManagerProps<Option, IsMulti, Group> &
	CreatableAdditionalProps<Option, Group> &
	AsyncAdditionalProps<Option, Group>;

type AsyncCreatableSelect = <
	Option = unknown,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>,
>(
	props: AsyncCreatableProps<Option, IsMulti, Group> &
		RefAttributes<Select<Option, IsMulti, Group>>,
) => ReactElement;

const AsyncCreatableSelect = forwardRef(
	<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
		props: AsyncCreatableProps<Option, IsMulti, Group>,
		ref:
			| ((instance: Select<Option, IsMulti, Group> | null) => void)
			| MutableRefObject<Select<Option, IsMulti, Group> | null>
			| null,
	) => {
		const stateManagerProps = useAsync(props);
		// @ts-ignore - TS2345: Complex generic type causing issues for help-center local consumption with TS 5.9.2
		const creatableProps = useStateManager(stateManagerProps);
		// @ts-ignore - TS2345: Complex generic type causing issues for help-center local consumption with TS 5.9.2
		const selectProps = useCreatable(creatableProps);

		// @ts-ignore - TS2322: Complex generic type causing issues for help-center local consumption with TS 5.9.2
		return <Select ref={ref} {...selectProps} />;
	},
) as AsyncCreatableSelect;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default AsyncCreatableSelect;
