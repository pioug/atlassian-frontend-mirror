import React, {
	forwardRef,
	type MutableRefObject,
	type ReactElement,
	type RefAttributes,
} from 'react';

import Select from './select';
import { type GroupBase } from './types';
import useCreatable, { type CreatableAdditionalProps } from './use-creatable';
import useStateManager, { type StateManagerProps } from './use-state-manager';

export type CreatableProps<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
> = StateManagerProps<Option, IsMulti, Group> & CreatableAdditionalProps<Option, Group>;

type CreatableSelect = <
	Option = unknown,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>,
>(
	props: CreatableProps<Option, IsMulti, Group> & RefAttributes<Select<Option, IsMulti, Group>>,
) => ReactElement;

const CreatableSelect = forwardRef(
	<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
		props: CreatableProps<Option, IsMulti, Group>,
		ref:
			| ((instance: Select<Option, IsMulti, Group> | null) => void)
			| MutableRefObject<Select<Option, IsMulti, Group> | null>
			| null,
	) => {
		const creatableProps = useStateManager(props);
		const selectProps = useCreatable(creatableProps);

		return <Select ref={ref} {...selectProps} />;
	},
) as CreatableSelect;

export { useCreatable };
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default CreatableSelect;
