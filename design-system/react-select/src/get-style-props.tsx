import type { StylesProps } from './styles';
import type { ClassNamesState, CommonPropsAndClassName, GroupBase } from './types';

export const getStyleProps: <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
	Key extends keyof StylesProps<Option, IsMulti, Group>,
>(
	props: Pick<
		CommonPropsAndClassName<Option, IsMulti, Group>,
		'cx' | 'getStyles' | 'getClassNames' | 'className'
	> &
		StylesProps<Option, IsMulti, Group>[Key],
	name: Key,
	classNamesState?: ClassNamesState,
) => {
	css: any;
	className: string;
} = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
	Key extends keyof StylesProps<Option, IsMulti, Group>,
>(
	props: Pick<
		CommonPropsAndClassName<Option, IsMulti, Group>,
		'cx' | 'getStyles' | 'getClassNames' | 'className'
	> &
		StylesProps<Option, IsMulti, Group>[Key],
	name: Key,
	classNamesState?: ClassNamesState,
): {
	css: any;
	className: string;
} => {
	const { cx, getStyles, getClassNames, className } = props;

	return {
		css: getStyles(name, props),
		className: cx(classNamesState ?? {}, getClassNames(name, props), className),
	};
};
